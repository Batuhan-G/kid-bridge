"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Child, ChildQuickSwitchProps } from './child-quick-switch.types'

export function ChildQuickSwitch({ children, selectedChild, onChildChange }: ChildQuickSwitchProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 h-12 bg-transparent">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-indigo-600 text-white text-sm">{selectedChild.avatar}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-medium">{selectedChild.name}</p>
            <p className="text-xs text-gray-500">{selectedChild.age} yaşında</p>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {children.map((child) => (
          <DropdownMenuItem
            key={child.id}
            onClick={() => onChildChange(child)}
            className="flex items-center space-x-3 p-3"
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-indigo-600 text-white">{child.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{child.name}</p>
              <p className="text-sm text-gray-500">{child.age} yaşında</p>
            </div>
            {child.unreadCount && child.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {child.unreadCount}
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
