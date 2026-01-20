"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  History,
  Scissors,
  Layers,
  BarChart3,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-12 space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white/90">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Creator"} 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to turn your videos into viral shorts?
          </p>
        </div>
        <Button
          size="lg"
          className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 font-bold text-lg transition-transform hover:scale-105 active:scale-95 group"
          asChild
        >
          <Link href="/editor">
            <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Scissors,
            label: "Total Projects",
            value: "0",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            icon: Zap,
            label: "AI Suggestions",
            value: "0",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
          },
          {
            icon: Layers,
            label: "Total Exports",
            value: "0",
            color: "text-green-500",
            bg: "bg-green-500/10",
          },
          {
            icon: Clock,
            label: "Saving Time",
            value: "0h",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl hover:bg-card/60 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <BarChart3 className="w-4 h-4 text-muted-foreground/30" />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white/80">
              <History className="w-5 h-5" />
              Recent Projects
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
              asChild
            >
              <Link href="/history">View all</Link>
            </Button>
          </div>

          <div className="bg-card/20 backdrop-blur-sm border-2 border-dashed border-white/5 min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-3xl group hover:border-white/10 transition-colors cursor-pointer">
            <Link href="/editor" className="flex flex-col items-center">
              <div className="bg-white/5 group-hover:bg-primary/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-colors">
                <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                No projects yet
              </h3>
              <p className="text-muted-foreground max-w-sm mb-8 text-lg">
                Start by uploading a video or pasting a URL to create your first
                short.
              </p>
              <Button className="rounded-full font-bold bg-white text-black hover:bg-white/90">
                Launch Editor
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Tips / Getting Started */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white/80 px-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Pro Tips
          </h2>
          <div className="bg-linear-to-br from-card/60 to-card/20 backdrop-blur-md border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white">
              Optimal Workflow
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold border border-primary/20">
                  1
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Upload a video between{" "}
                  <span className="text-white font-medium">1-5 minutes</span>{" "}
                  for the best AI results.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold border border-primary/20">
                  2
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Use the{" "}
                  <span className="text-white font-medium">
                    9:16 aspect ratio
                  </span>{" "}
                  for YouTube Shorts and TikTok.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold border border-primary/20">
                  3
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enable{" "}
                  <span className="text-white font-medium">captions</span> to
                  increase viewer retention by up to 80%.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full mt-8 bg-white/5 hover:bg-white/10 text-white border-0 h-10 rounded-xl"
            >
              Watch Tutorial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
