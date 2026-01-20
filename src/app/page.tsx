"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Scissors, Zap, Shield, PlayCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 ambient-glow">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 md:pt-56 md:pb-40 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[20%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge
                variant="secondary"
                className="mb-8 px-4 py-1.5 text-xs font-medium border-primary/20 bg-primary/10 text-primary"
              >
                ✨ World&apos;s First Client-Side AI Generator
              </Badge>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-10 leading-[0.95]">
                Create Viral Shorts
                <br />
                <span className="gradient-text">In Seconds.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                Zero server costs. Zero wait times. All processing happens
                entirely in your browser using cutting-edge WebAssembly
                technology.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base rounded-2xl btn-premium group"
                  asChild
                >
                  <Link href="/editor">
                    Start Creating Free
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 interactive" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base rounded-2xl ghost-border-visible hover:bg-white/4 interactive"
                >
                  <PlayCircle className="mr-2 w-4 h-4" strokeWidth={1.5} />
                  See How It Works
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm">
                Power meets <span className="text-primary">Simplicity</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto opacity-80">
                Engineered for speed, designed for flow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[240px]">
              {/* Feature 1: Instant Analysis (Large) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="col-span-12 md:col-span-7 liquid-panel p-8 flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-400 ease-magnetic">
                    <Zap className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">
                    Instant Analysis
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    Our local AI engine identifies the most engaging moments in
                    your footage instantly. No uploads, no waiting.
                  </p>
                </div>
                <div className="w-full h-1 bg-linear-to-r from-primary/50 to-transparent rounded-full mt-4" />
              </motion.div>

              {/* Feature 2: Privacy (Tall/Medium) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="col-span-12 md:col-span-5 liquid-panel p-8 flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-400 ease-magnetic">
                      <Shield
                        className="w-6 h-6 text-sky-400"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Privacy First</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Local-only processing means your raw footage never leaves
                    your device. 100% secure by design.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3: Wasm Processing (Medium) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="col-span-12 md:col-span-5 liquid-panel p-8 flex flex-col justify-center group h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-400 ease-magnetic">
                    <Scissors
                      className="w-6 h-6 text-purple-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Wasm Powered</h3>
                  <p className="text-muted-foreground text-sm">
                    Cutting-edge WebAssembly technology delivers native feedback
                    speeds in the browser.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4: 9:16 Optimized (Large) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
                className="col-span-12 md:col-span-7 liquid-panel p-8 flex flex-row items-center gap-6 group h-full"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">9:16 Ready</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Auto-crop and smart reframing designed specifically for
                    Shorts, Reels, and TikTok virality.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-400 ease-magnetic">
                  <PlayCircle
                    className="w-8 h-8 text-pink-500"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="liquid-glass rounded-[2rem] p-12 md:p-16 relative overflow-hidden elevation-2">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                <div>
                  <div className="text-5xl md:text-6xl font-bold mb-2 gradient-text">
                    $0
                  </div>
                  <div className="text-muted-foreground uppercase tracking-widest font-medium text-xs">
                    Monthly Fees
                  </div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold mb-2 gradient-text">
                    100%
                  </div>
                  <div className="text-muted-foreground uppercase tracking-widest font-medium text-xs">
                    Client Side
                  </div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold mb-2 gradient-text">
                    ∞
                  </div>
                  <div className="text-muted-foreground uppercase tracking-widest font-medium text-xs">
                    Export Limits
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
