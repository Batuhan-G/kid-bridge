"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, Bell } from "lucide-react"

interface SidebarTriggerProps {
  onToggle: () => void
  totalStats: {
    events: number
    messages: number
    expenses: number
  }
}

export function SidebarTrigger({ onToggle, totalStats }: SidebarTriggerProps) {
  const totalNotifications = totalStats.events + totalStats.messages

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
        <Menu className="w-5 h-5" />
      </Button>

      {/* Desktop Sidebar Toggle */}
      <Button variant="ghost" size="sm" onClick={onToggle} className="hidden lg:flex">
        <Menu className="w-5 h-5" />
      </Button>

      {/* Notification Badge */}
      {totalNotifications > 0 && (
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {totalNotifications > 99 ? "99+" : totalNotifications}
          </Badge>
        </div>
      )}
    </div>
  )
}
