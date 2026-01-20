"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Bell, User, Cpu, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="space-y-2">
          {[
            { icon: User, label: "Profile" },
            { icon: Cpu, label: "Hardware" },
            { icon: Bell, label: "Notifications" },
            { icon: Shield, label: "Privacy" },
          ].map((item, i) => (
            <Button
              key={i}
              variant={i === 0 ? "secondary" : "ghost"}
              className="w-full justify-start gap-2 h-10 px-4 rounded-lg font-bold uppercase tracking-wider text-[10px]"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">
                Profile Information
              </CardTitle>
              <CardDescription>
                Manage your public identity and account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-4 border-primary/10">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="text-2xl font-black">
                    {session?.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{session?.user?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input defaultValue={session?.user?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue={session?.user?.email || ""} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-primary">
                Local Analysis Preferences
              </CardTitle>
              <CardDescription>
                Configure how AI models run in your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-balance">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">
                    Use Tiny Whisper Model
                  </Label>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Faster processing but lower accuracy. Best for devices with
                    low RAM.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between border-t pt-6">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">
                    Enable Multithreading
                  </Label>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Uses all available CPU cores via SharedArrayBuffer for
                    faster encoding.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="h-11 px-8 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              className="h-11 px-8 rounded-xl font-bold gap-2"
              onClick={() => toast.success("Settings saved!")}
            >
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
