import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;

interface ExportOptions {
  inputBlob: Blob;
  startTime: number;
  endTime: number;
  aspectRatio: "9:16" | "1:1";
  quality?: "low" | "medium" | "high";
  captions?: {
    enabled: boolean;
    srtContent: string;
    style: string;
  };
  watermark?: {
    enabled: boolean;
  };
}

interface FFmpegCommand {
  type: "load" | "trim" | "resize" | "addCaptions" | "addWatermark" | "export";
  payload: ExportOptions | unknown;
}

async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  ffmpeg.on("log", ({ message }) => {
    self.postMessage({
      type: "log",
      stage: "process",
      payload: { message },
      timestamp: Date.now(),
    });
  });

  ffmpeg.on("progress", ({ progress, time }) => {
    self.postMessage({
      type: "progress",
      stage: "process",
      payload: {
        progress: Math.round(progress * 100),
        timeElapsedMs: time,
      },
      timestamp: Date.now(),
    });
  });

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    workerURL: await toBlobURL(
      `${baseURL}/ffmpeg-core.worker.js`,
      "text/javascript",
    ),
  });

  return ffmpeg;
}

async function exportVideo(options: ExportOptions): Promise<Blob> {
  const ff = await loadFFmpeg();

  // Write input file
  await ff.writeFile("input.mp4", await fetchFile(options.inputBlob));

  // Build FFmpeg Filter Complex
  const filterComplex: string[] = [];
  let currentStream = "0:v"; // Start with input video stream

  // 1. Aspect Ratio (Crop/Scale)
  // We used to do simple scale/pad, but for "Smart Crop" we ideally want crop filter.
  // For now, let's keep the user's aspect ratio selection logic
  // '9:16' -> scale to fit height 1920, then crop width 1080? Or pad?
  // User requested "Scale + Pad" in previous logic, let's stick to Pad to be safe unless we have crop coordinates.
  // Actually, if we want to fill the screen (9:16) from a 16:9 source, we should CROP, not pad (which adds black bars).
  // But without smart crop coordinates passed here, naive crop is centered.
  // Let's stick to the previous safe "force_original_aspect_ratio=decrease,pad" logic for now to avoid losing content,
  // OR switch to "increase" and crop to fill if the user wants "Cover" behavior.
  // Given "QuickAI Shorts" usually implies full screen content, let's try "increase" + "crop" for 9:16 ?
  // No, let's stick to the robust one from before but chain it properly.

  const scaleFilter =
    options.aspectRatio === "9:16"
      ? "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2"
      : options.aspectRatio === "1:1"
        ? "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2"
        : "null"; // 16:9 or default

  if (scaleFilter !== "null") {
    filterComplex.push(`[${currentStream}]${scaleFilter}[scaled]`);
    currentStream = "scaled";
  }

  // 2. Watermark
  if (options.watermark?.enabled) {
    // We accept a URL for the watermark or default to fetching /qs-logo.png if we can (but worker scope...)
    // Better if the main thread passes the watermark blob or url.
    // Let's assuming options.watermark.url is passed, or we fail gracefully back to text.
    // For this implementation, I'll rely on a hardcoded fetch if url is missing, assuming relative path works in some setups,
    // but absolute URL is safer.

    try {
      // Use a default public URL if none provided.
      // Note: In production, use absolute URL. In dev, localhost.
      const watermarkUrl =
        (options.watermark as { url?: string }).url || "/qs-logo.png";
      await ff.writeFile("watermark.png", await fetchFile(watermarkUrl));

      // Add watermark image to inputs? No, use movie filter or standard -i if possible.
      // FFmpeg.wasm supports multiple inputs. Let's try loading it as input -1?
      // Actually, 'movie=watermark.png' is supported in filter complex.

      // Scale watermark to be reasonable (e.g., 20% of width)
      filterComplex.push(`movie=watermark.png,scale=200:-1[wm]`);
      filterComplex.push(
        `[${currentStream}][wm]overlay=main_w-overlay_w-20:main_h-overlay_h-20[watermarked]`,
      );
      currentStream = "watermarked";
    } catch (e) {
      console.warn("Failed to load watermark image, falling back to text", e);
      // Fallback to text
      filterComplex.push(
        `[${currentStream}]drawtext=text='QuickAI':fontsize=48:fontcolor=white@0.8:x=w-tw-40:y=h-th-40[watermarked]`,
      );
      currentStream = "watermarked";
    }
  }

  // 3. Captions
  // Note: 'subtitles' filter usually takes a filename.
  // It applies to the video stream.
  if (options.captions?.enabled && options.captions.srtContent) {
    await ff.writeFile("captions.srt", options.captions.srtContent);
    // Escape style string if needed
    const style =
      options.captions.style ||
      "Fontname=Montserrat,FontSize=16,PrimaryColour=&H00FFFF00,OutlineColour=&H00000000,BorderStyle=1,Outline=1,Shadow=0,Alignment=2,MarginV=20";

    // Complex filter approach for subtitles is: subtitles=filename
    // Note: If we pushed to filters array above, we need to sync with filterComplex array approach.
    // Let's unify.
    filterComplex.push(
      `[${currentStream}]subtitles=captions.srt:force_style='${style}'[outv]`,
    );
    currentStream = "outv";
  } else {
    // If no captions, just label the output
    filterComplex.push(`[${currentStream}]null[outv]`);
  }

  // Build final command
  // Inputs: -i input.mp4
  // We Map [outv] to output
  // Audio: -c:a aac

  const command = [
    "-i",
    "input.mp4",
    "-ss",
    String(options.startTime),
    "-t",
    String(options.endTime - options.startTime),
    "-filter_complex",
    filterComplex.join(";"),
    "-map",
    "[outv]",
    "-map",
    "0:a", // Map original audio. Note: trimming might desync if we don't apply trimming to audio too?
    // -ss and -t before -i handles fast seek, but here we put it after?
    // Putting -ss before -i is faster.
    // Putting -ss after -i is accurate.
    // Transcoding happens here.

    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
  ];

  // Quality
  const qualitySettings = {
    low: { crf: "28", preset: "ultrafast" },
    medium: { crf: "23", preset: "veryfast" },
    high: { crf: "18", preset: "fast" },
  };
  const quality = qualitySettings[options.quality || "medium"];
  command.push("-crf", quality.crf, "-preset", quality.preset);

  command.push("output.mp4");

  await ff.exec(command);

  const data = await ff.readFile("output.mp4");
  return new Blob([data as BlobPart], { type: "video/mp4" });
}

self.onmessage = async (e: MessageEvent<FFmpegCommand>) => {
  try {
    const { type, payload } = e.data;

    switch (type) {
      case "load":
        await loadFFmpeg();
        self.postMessage({
          type: "status",
          stage: "load",
          payload: { message: "FFmpeg loaded" },
        });
        break;

      case "export":
        const blob = await exportVideo(payload as ExportOptions);
        self.postMessage({
          type: "artifact",
          stage: "finalize",
          payload: { artifact: blob },
        });
        break;
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      stage: "process",
      payload: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
};
