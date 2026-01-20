"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { History, Settings, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { LiquidThemeToggle } from "@/components/shared/LiquidThemeToggle";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 liquid-glass ghost-border-visible">
      <div className="container mx-auto px-8 h-16 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-4">
          <LiquidThemeToggle />
          {status === "authenticated" ? (
            <>
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground interactive h-9 px-4"
                  asChild
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground interactive h-9 px-4"
                  asChild
                >
                  <Link href="/history">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Link>
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-1 ring-white/[0.08] hover:ring-primary/40 interactive p-0 overflow-hidden"
                  >
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
                        {session.user?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 liquid-glass text-foreground p-1.5"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/[0.06]" />
                  <DropdownMenuItem
                    className="focus:bg-white/[0.06] cursor-pointer rounded-lg interactive"
                    asChild
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-2 text-muted-foreground" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="focus:bg-white/[0.06] cursor-pointer rounded-lg interactive"
                    asChild
                  >
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/[0.06]" />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-lg interactive"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              onClick={() => signIn("google")}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full px-6 h-9 btn-premium"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
