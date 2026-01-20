import { useEffect, useRef, useState, useCallback } from "react";
import { WorkerMessage } from "@/types/pipeline";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useFaceTracker() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [faceBox, setFaceBox] = useState<Box | null>(null);

  // Smooth box state for dampening
  const smoothBox = useRef<Box | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/face.worker.ts", import.meta.url),
    );

    workerRef.current.onmessage = (event) => {
      const msg = event.data as WorkerMessage;

      if (msg.type === "status" && msg.stage === "ready") {
        setIsReady(true);
      }

      if (msg.type === "face_detected" && msg.payload.face) {
        const rawBox = msg.payload.face.box;

        // Dampening Logic (LERP)
        if (!smoothBox.current) {
          smoothBox.current = rawBox;
        } else {
          const factor = 0.15; // Tuning for smoothness vs responsiveness
          smoothBox.current = {
            x: lerp(smoothBox.current.x, rawBox.x, factor),
            y: lerp(smoothBox.current.y, rawBox.y, factor),
            width: lerp(smoothBox.current.width, rawBox.width, factor),
            height: lerp(smoothBox.current.height, rawBox.height, factor),
          };
        }
        setFaceBox({ ...smoothBox.current });
      }
    };

    // Initialize
    workerRef.current.postMessage({ type: "init" });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const detect = useCallback(
    (video: HTMLVideoElement) => {
      if (!workerRef.current || !isReady || video.paused || video.ended) return;

      // Create a bitmap from the video frame to send to worker
      // Note: createImageBitmap IS available in window, but might lag.
      // MediaPipe usually wants data, but TFLite worker can take ImageBitmap.
      createImageBitmap(video)
        .then((bitmap) => {
          workerRef.current?.postMessage(
            {
              type: "detect",
              payload: { frame: bitmap, timestamp: Date.now() },
            },
            [bitmap], // Transferable
          );
        })
        .catch((err) => {
          // Frame might be not ready
        });
    },
    [isReady],
  );

  return { isReady, faceBox: faceBox, detect };
}

function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}
