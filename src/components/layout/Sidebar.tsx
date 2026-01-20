"use client";

import {
  LucideIcon,
  Upload,
  Settings,
  History,
  Home,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  href,
  onClick,
}: SidebarItemProps) {
  const content = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "w-10 h-10 rounded-xl interactive relative",
        active
          ? "bg-primary text-primary-foreground elevation-2"
          : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
      )}
      onClick={onClick}
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
    </Button>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? <Link href={href}>{content}</Link> : content}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="liquid-glass text-foreground text-xs font-medium px-3 py-1.5"
        >
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside
      className="fixed z-50 liquid-glass elevation-2 interactive
      bottom-4 left-4 right-4 h-14 flex flex-row items-center justify-around px-2
      md:top-1/2 md:left-5 md:bottom-auto md:right-auto md:w-14 md:h-auto md:-translate-y-1/2 md:flex-col md:py-5 md:gap-4 md:px-0 md:justify-center rounded-2xl"
    >
      <div className="md:mb-1">
        <SidebarItem
          icon={Home}
          label="Dashboard"
          href="/dashboard"
          active={pathname === "/dashboard"}
        />
      </div>

      <div className="hidden md:block w-6 h-px bg-white/[0.08] rounded-full" />

      <div className="flex flex-row md:flex-col gap-1 md:gap-3">
        <SidebarItem
          icon={Upload}
          label="Editor"
          href="/editor"
          active={pathname === "/editor"}
        />
        <SidebarItem
          icon={History}
          label="History"
          href="/history"
          active={pathname === "/history"}
        />
      </div>

      <div className="mt-0 md:mt-auto flex flex-row md:flex-col gap-1 md:gap-3 items-center">
        <div className="hidden md:block w-6 h-px bg-white/[0.08] rounded-full" />
        <SidebarItem
          icon={Settings}
          label="Settings"
          href="/settings"
          active={pathname === "/settings"}
        />

        <ThemeToggle />

        {session?.user && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative group cursor-pointer ml-1 md:ml-0 mt-1 md:mt-2">
                  <Avatar className="w-8 h-8 ring-1 ring-white/[0.08] group-hover:ring-primary/40 interactive">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-primary/15 text-primary-foreground text-xs font-medium">
                      {session.user.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="liquid-glass p-0 overflow-hidden min-w-[180px] ml-2"
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-medium text-foreground">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {session.user.email}
                  </p>
                </div>
                <div className="p-1.5">
                  <div className="mx-2 mb-2 py-1.5 px-2 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                      Free for Life
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-3 interactive"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </aside>
  );
}
