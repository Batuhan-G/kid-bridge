"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Bell } from "lucide-react";
import type { SidebarTriggerProps } from "./sidebar-trigger.types";

export function SidebarTrigger({ onToggle, totalStats }: SidebarTriggerProps) {
  const totalNotifications = totalStats.events + totalStats.messages;

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Desktop Sidebar Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="hidden lg:flex"
      >
        <Menu className="w-5 h-5" />
      </Button>
    </div>
  );
}
