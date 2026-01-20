export interface TranscriptChunk {
  text: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface Transcript {
  chunks: TranscriptChunk[];
  text: string;
  segments?: TranscriptChunk[];
}

export interface Clip {
  id: string;
  start: number;
  end: number;
  confidence: number;
  reason: string;
  aspectRatio: "9:16" | "1:1";
  captionsEnabled: boolean;
  status: "pending" | "ready" | "exporting" | "exported";
}

export type WorkerStatus =
  | "idle"
  | "loading"
  | "ready"
  | "running"
  | "error"
  | "transcribing"
  | "analyzing";

export interface WorkerMessagePayload {
  message?: string;
  progress?: number;
  bytesLoaded?: number;
  bytesTotal?: number;
  framesProcessed?: number;
  framesTotal?: number;
  timeElapsedMs?: number;
  etaMs?: number;
  artifact?: Blob | ArrayBuffer;
  transcript?: Transcript;
  suggestions?: Clip[]; // Raw suggestions might match Clip or need mapping
  face?: {
    box: { x: number; y: number; width: number; height: number };
    confidence: number;
  };
  segments?: CutSegment[];
  // Add other specific payload fields here
  [key: string]: unknown;
}

export interface WorkerMessage {
  type:
    | "status"
    | "progress"
    | "log"
    | "warning"
    | "error"
    | "complete"
    | "artifact"
    | "face_detected"
    | "silence_detected";
  stage:
    | "init"
    | "download"
    | "load"
    | "process"
    | "encode"
    | "finalize"
    | "detect"
    | "ready"
    | "complete";
  payload: WorkerMessagePayload;
  timestamp: number;
}

export interface CutSegment {
  start: number;
  end: number;
  type: "keep" | "silence";
}
