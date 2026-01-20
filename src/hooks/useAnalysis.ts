"use client";

import { useCallback } from "react";
import { useWorker } from "./useWorker";

export function useAnalysis() {
  const workerFactory = useCallback(() => {
    return new Worker(
      new URL("../workers/analysis.worker.ts", import.meta.url),
    );
  }, []);

  const {
    status,
    progress,
    lastMessage,
    error,
    initWorker,
    postMessage,
    terminateWorker,
  } = useWorker(workerFactory);

  const analyze = useCallback(
    (payload: {
      audioData: Float32Array;
      transcript: { chunks: { start: number; end: number; text: string }[] };
      duration: number;
      sampleRate: number;
    }) => {
      postMessage("analyze", payload);
    },
    [postMessage],
  );

  return {
    isReady: status === "ready" || status === "idle",
    isAnalyzing: status === "running",
    progress,
    lastMessage,
    error,
    analyze,
    detectSilence: (payload: {
      audioData: Float32Array;
      sampleRate: number;
    }) => {
      postMessage("detect_silence", payload);
    },
    status,
    init: initWorker,
    terminate: terminateWorker,
  };
}
