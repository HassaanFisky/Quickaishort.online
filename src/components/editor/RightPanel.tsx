"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Crop, Type, Wand2 } from "lucide-react";

import { useEditorStore } from "@/stores/editorStore";

export default function RightPanel() {
  const { captionsEnabled, setCaptionsEnabled } = useEditorStore();

  return (
    <div className="w-full flex flex-col gap-5 animate-in slide-in-from-right-4 duration-500 delay-100">
      {/* Header */}
      <div className="flex items-center gap-2 text-muted-foreground pb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest">
          Controls
        </span>
      </div>

      {/* Caption Module */}
      <div className="space-y-4 p-5 liquid-glass rounded-2xl elevation-1">
        <div className="flex items-center gap-2 text-foreground">
          <Type className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <span className="font-medium text-sm">Captions</span>
        </div>

        <div className="space-y-4">
          <Select defaultValue="inter">
            <SelectTrigger className="h-9 bg-secondary/50 border-white/[0.06] text-xs">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent className="liquid-glass">
              <SelectItem value="inter">Inter Bold</SelectItem>
              <SelectItem value="montserrat">Montserrat</SelectItem>
              <SelectItem value="bebas">Bebas Neue</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Enabled</Label>
            <Switch
              checked={captionsEnabled}
              onCheckedChange={setCaptionsEnabled}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Size</span>
              <span>42px</span>
            </div>
            <Slider defaultValue={[42]} max={100} step={1} className="py-1" />
          </div>
        </div>
      </div>

      {/* Crop Module */}
      <div className="space-y-4 p-5 liquid-glass rounded-2xl elevation-1">
        <div className="flex items-center gap-2 text-foreground">
          <Crop className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <span className="font-medium text-sm">Aspect Ratio</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "9:16", sub: "Shorts", active: true },
            { label: "1:1", sub: "Square", active: false },
            { label: "16:9", sub: "Wide", active: false },
          ].map((ratio) => (
            <button
              key={ratio.label}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border interactive ${
                ratio.active
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-secondary/50 ghost-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              <div
                className={`border-2 rounded-sm mb-1.5 ${
                  ratio.active ? "border-primary" : "border-current opacity-40"
                } ${
                  ratio.label === "9:16"
                    ? "w-3 h-5"
                    : ratio.label === "1:1"
                      ? "w-4 h-4"
                      : "w-5 h-3"
                }`}
              />
              <span className="text-[10px] font-semibold">{ratio.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <Label className="text-xs text-foreground">Smart Crop</Label>
            <span className="text-[10px] text-muted-foreground">
              Auto-face tracking
            </span>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      {/* Magic Cut Module */}
      <div className="space-y-4 p-5 liquid-glass rounded-2xl elevation-1">
        <div className="flex items-center gap-2 text-foreground">
          <Wand2 className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <span className="font-medium text-sm">Magic Cut</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Label className="text-xs text-foreground">Silence (-45dB)</Label>
            <span className="text-[10px] text-muted-foreground">
              Auto-remove quiet parts
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs px-3 interactive"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("trigger-silence-detect"));
            }}
          >
            Analyze
          </Button>
        </div>
      </div>
    </div>
  );
}
