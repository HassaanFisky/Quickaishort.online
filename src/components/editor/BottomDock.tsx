"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useMediaEngine } from "@/hooks/useMediaEngine";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generateSRT } from "@/lib/utils/srtGenerator";

export default function BottomDock() {
  const { transcript, sourceFile, selectedClipId, suggestions } =
    useEditorStore();
  const { exportVideo, isProcessing, status, lastMessage } = useMediaEngine();

  const selectedClip = suggestions.find((c) => c.id === selectedClipId);

  const handleExport = async () => {
    if (!sourceFile || !selectedClip) {
      toast.error("Please select a clip to export");
      return;
    }

    try {
      toast.info("Starting render...");
      const srt = transcript
        ? generateSRT(transcript.chunks, selectedClip.start, selectedClip.end)
        : "";

      exportVideo({
        inputBlob: sourceFile,
        startTime: selectedClip.start,
        endTime: selectedClip.end,
        aspectRatio: "9:16",
        captions: {
          enabled: !!srt,
          srtContent: srt,
          style:
            "Alignment=10,FontSize=24,PrimaryColour=&H00FFFFFF,Outline=1,Shadow=0",
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    }
  };

  useEffect(() => {
    if (
      status === "ready" &&
      lastMessage?.type === "artifact" &&
      lastMessage.payload.artifact
    ) {
      const blob = lastMessage.payload.artifact as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quickai_short_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Download started!");
    }
  }, [status, lastMessage]);

  const words = transcript?.chunks || [];

  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(
    new Array(100).fill(42.5), // Start with average height
  );

  useEffect(() => {
    // eslint-disable-next-line
    setVisualizerHeights(
      Array.from({ length: 100 }).map(() => 15 + Math.random() * 55),
    );
  }, []);

  return (
    <div className="flex items-end gap-5 animate-in slide-in-from-bottom-4 duration-500 delay-200">
      {/* Timeline Dock */}
      <div className="flex-1 liquid-panel rounded-2xl overflow-hidden">
        {/* Waveform */}
        <div className="h-16 relative ghost-border-visible border-b group overflow-hidden">
          <div className="absolute inset-0 flex items-center px-4 gap-0.5 pointer-events-none opacity-40">
            {visualizerHeights.map((height, i) => (
              <div
                key={i}
                className="w-0.5 bg-primary/60 rounded-full interactive"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          {/* Playhead */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/80 z-20" />
        </div>

        {/* Caption Stream */}
        <div className="h-9 px-4 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-medium text-muted-foreground whitespace-nowrap">
          {words.length > 0 ? (
            words.map(
              (
                chunk: { text: string; start: number; end: number },
                i: number,
              ) => (
                <span
                  key={i}
                  className="text-foreground/80 hover:text-primary cursor-pointer hover:bg-white/4 px-1.5 py-0.5 rounded interactive"
                >
                  {chunk.text}
                </span>
              ),
            )
          ) : (
            <span className="text-muted-foreground/40 italic text-[11px]">
              Waiting for transcription...
            </span>
          )}
        </div>
      </div>

      {/* Export Button */}
      <div className="pb-1">
        <Button
          size="lg"
          className={cn(
            "h-12 px-7 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm btn-premium group",
            isProcessing && "opacity-80 cursor-not-allowed",
          )}
          onClick={handleExport}
          disabled={isProcessing || !selectedClipId}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Export Short
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 interactive" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
