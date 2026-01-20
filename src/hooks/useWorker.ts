"use client";

import { useState, useCallback, useEffect, useRef } from "react";

import { WorkerMessage, WorkerStatus } from "@/types/pipeline";

export { type WorkerMessage, type WorkerStatus };

export function useWorker(workerFactory: () => Worker) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [status, setStatus] = useState<WorkerStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [lastMessage, setLastMessage] = useState<WorkerMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initWorker = useCallback(() => {
    try {
      setStatus("loading");
      const w = workerFactory();

      w.onmessage = (e: MessageEvent<WorkerMessage>) => {
        const msg = e.data;
        setLastMessage(msg);

        if (msg.type === "progress" && msg.payload.progress !== undefined) {
          setProgress(msg.payload.progress);
        }

        if (msg.type === "status" && msg.stage === "load") {
          setStatus("ready");
        }

        if (msg.type === "error") {
          setStatus("error");
          setError(msg.payload.message || "Unknown worker error");
        }
      };

      w.onerror = (e) => {
        console.error("Worker error:", e);
        setStatus("error");
        setError("Worker crashed or failed to load");
      };

      setWorker(w);
      return w;
    } catch (err) {
      console.error("Failed to initialize worker:", err);
      setStatus("error");
      setError("Failed to initialize worker");
      return null;
    }
  }, [workerFactory]);

  const terminateWorker = useCallback(() => {
    if (worker) {
      worker.terminate();
      setWorker(null);
      setStatus("idle");
    }
  }, [worker]);

  const postMessage = useCallback(
    (type: string, payload: unknown) => {
      if (!worker) {
        console.error("Worker not initialized");
        return;
      }
      worker.postMessage({ type, payload });
    },
    [worker],
  );

  return {
    worker,
    status,
    progress,
    lastMessage,
    error,
    initWorker,
    terminateWorker,
    postMessage,
  };
}
