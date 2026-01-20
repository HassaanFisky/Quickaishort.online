"use client";

import { useCallback } from "react";
import { useWorker } from "./useWorker";

export function useMediaEngine() {
  const workerFactory = useCallback(() => {
    return new Worker(new URL("../workers/ffmpeg.worker.ts", import.meta.url));
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

  const load = useCallback(() => {
    postMessage("load", {});
  }, [postMessage]);

  const exportVideo = useCallback(
    (options: Record<string, unknown>) => {
      postMessage("export", options);
    },
    [postMessage],
  );

  return {
    isReady: status === "ready",
    isLoading: status === "loading",
    isProcessing: status === "running",
    progress,
    lastMessage,
    error,
    load,
    exportVideo,
    status,
    init: initWorker,
    terminate: terminateWorker,
  };
}
