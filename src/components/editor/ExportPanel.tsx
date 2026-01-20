"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useMediaEngine } from "@/hooks/useMediaEngine";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Rocket, ShieldCheck, Clock, Settings2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import { generateSRT } from "@/lib/utils/srtGenerator";

export default function ExportPanel() {
  const {
    suggestions,
    selectedClipId,
    sourceFile,
    transcript,
    captionsEnabled,
  } = useEditorStore();
  const mediaEngine = useMediaEngine();
  const [exportComplete, setExportComplete] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const selectedClip = suggestions.find((s) => s.id === selectedClipId);

  const handleExport = async () => {
    if (!sourceFile || !selectedClip) {
      toast.error("Please select a clip to export");
      return;
    }

    setExportComplete(false);
    toast.info("Exporting video... This may take a minute.");

    // Generate SRT if transcript exists
    let srtContent = "";
    if (transcript && transcript.chunks) {
      srtContent = generateSRT(
        transcript.chunks,
        selectedClip.start,
        selectedClip.end,
      );
    }

    mediaEngine.exportVideo({
      inputBlob: sourceFile,
      startTime: selectedClip.start,
      endTime: selectedClip.end,
      aspectRatio: selectedClip.aspectRatio || "9:16",
      quality: "medium",
      watermark: { enabled: true, url: "/qs-logo.png" }, // Explicitly pass logo URL
      captions: {
        enabled: captionsEnabled,
        srtContent: srtContent,
        style:
          "Fontname=Montserrat,FontSize=16,PrimaryColour=&H00FFFF00,OutlineColour=&H00000000,BorderStyle=1,Outline=1,Shadow=0,Alignment=2,MarginV=20",
      },
    });
  };

  useEffect(() => {
    if (mediaEngine.lastMessage?.type === "artifact") {
      const blob = mediaEngine.lastMessage.payload.artifact as Blob;
      const url = URL.createObjectURL(blob);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExportUrl(url);
      setExportComplete(true);
      toast.success("Video exported successfully!");
    }
  }, [mediaEngine.lastMessage]);

  const downloadVideo = () => {
    if (!exportUrl) return;
    const a = document.createElement("a");
    a.href = exportUrl;
    a.download = `quickai-short-${Date.now()}.mp4`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500">
      <Card className="border-2 border-primary/10 overflow-hidden">
        <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Export Configuration
            </span>
          </div>
          {mediaEngine.progress > 0 && (
            <span className="text-xs font-mono">{mediaEngine.progress}%</span>
          )}
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase">
              Output Format
            </Label>
            <Select defaultValue="mp4">
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4 (H.264 + AAC)</SelectItem>
                <SelectItem value="webm">WebM (VP9 + Opus)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase">
              Quality Preset
            </Label>
            <Select defaultValue="medium">
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Faster, ~2MB/s)</SelectItem>
                <SelectItem value="medium">
                  Medium (Recommended, ~5MB/s)
                </SelectItem>
                <SelectItem value="high">High (Maximum, ~10MB/s)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-4">
            {mediaEngine.isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                  <span>Loading Engine</span>
                  <span>{mediaEngine.progress}%</span>
                </div>
                <Progress value={mediaEngine.progress} className="h-1.5" />
              </div>
            )}

            {mediaEngine.isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                  <span>Rendering Clip</span>
                  <span>{mediaEngine.progress}%</span>
                </div>
                <Progress value={mediaEngine.progress} className="h-1.5" />
              </div>
            )}

            {!exportComplete ? (
              <Button
                className="w-full h-12 rounded-xl text-lg font-black shadow-xl shadow-primary/20 group"
                onClick={handleExport}
                disabled={!selectedClipId || mediaEngine.isProcessing}
              >
                <Rocket className="mr-2 w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                Render Selection
              </Button>
            ) : (
              <Button
                className="w-full h-12 rounded-xl text-lg font-black bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/20 group animate-in zoom-in-95 duration-300"
                onClick={downloadVideo}
              >
                <Download className="mr-2 w-5 h-5 group-hover:bounce transition-transform" />
                Download MP4
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border bg-card/50 flex flex-col items-center text-center gap-1">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span className="text-[10px] font-bold uppercase">Private</span>
        </div>
        <div className="p-3 rounded-xl border bg-card/50 flex flex-col items-center text-center gap-1">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-bold uppercase">Fast</span>
        </div>
      </div>

      <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/20">
        <div className="flex gap-3">
          <Settings2 className="w-5 h-5 text-yellow-500 shrink-0" />
          <p className="text-[11px] text-yellow-500/80 leading-relaxed font-medium">
            Large exports may freeze your tab briefly. This is normal as all
            processing is happening locally on your hardware.
          </p>
        </div>
      </div>
    </div>
  );
}
