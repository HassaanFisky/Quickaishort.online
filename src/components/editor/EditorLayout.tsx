"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useMediaPipeline } from "@/hooks/useMediaPipeline";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

// Components
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import BottomDock from "./BottomDock";
import VideoCanvas from "./VideoCanvas";
import Sidebar from "@/components/layout/Sidebar";

export default function EditorLayout() {
  const { setSourceFile } = useEditorStore();
  const { runPipeline, status } = useMediaPipeline();
  const [urlInput, setUrlInput] = useState("");

  const isAnalysing = (
    ["analyzing", "loading", "transcribing"] as string[]
  ).includes(status || "");

  const handleAnalyze = async (file?: File) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setSourceFile(file, url);
      await runPipeline();
    } else if (urlInput) {
      toast.error("For best performance, please drag & drop a video file!");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        handleAnalyze(file);
      } else {
        toast.error("Please upload a video file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center p-6 gap-8 pl-4 md:pl-24 pb-28 md:pb-8 ambient-glow"
    >
      <Sidebar />

      {/* Header Logo */}
      <div className="absolute top-6 left-24 z-40 hidden md:flex items-center gap-3 select-none">
        <div className="relative w-7 h-7">
          <Image
            src="/qs-logo.png"
            alt="QS Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-semibold text-base tracking-tight text-foreground/80">
          QuickAI Shorts
        </span>
      </div>

      {/* Search Island */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 md:px-0">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/15 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 interactive" />
          <div className="relative flex items-center liquid-glass rounded-2xl pl-5 pr-2 h-12 interactive group-focus-within:ring-1 ring-primary/30">
            <Search
              className="w-4 h-4 text-muted-foreground mr-3"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Paste YouTube Link or Drag & Drop..."
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground/60 h-full"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <AnimatePresence>
              {(urlInput || isAnalysing) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="sm"
                    className="rounded-xl h-8 px-4 font-medium bg-primary hover:bg-primary/90 text-primary-foreground btn-premium text-xs"
                    onClick={() => handleAnalyze()}
                    disabled={isAnalysing}
                  >
                    {isAnalysing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="capitalize">{status}</span>
                      </div>
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-10 items-center h-auto lg:h-full pt-20 pb-32 overflow-y-auto lg:overflow-visible">
        {/* Left Panel */}
        <div className="h-[500px] lg:h-full flex flex-col justify-center order-2 lg:order-1">
          <LeftPanel />
        </div>

        {/* Center Stage */}
        <div className="h-[60vh] lg:h-full flex items-center justify-center relative order-1 lg:order-2">
          <VideoCanvas />
        </div>

        {/* Right Panel */}
        <div className="h-auto lg:h-full flex flex-col justify-start pt-8 order-3 lg:order-3">
          <RightPanel />
        </div>
      </div>

      {/* Bottom Dock */}
      <div className="absolute bottom-20 md:bottom-6 w-full max-w-4xl px-6">
        <BottomDock />
      </div>
    </div>
  );
}
