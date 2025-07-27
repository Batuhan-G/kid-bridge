"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Child, ChildSelectorProps } from './child-selector.types'

export function ChildSelector({ children, selectedChild, onChildChange, showAll = false }: ChildSelectorProps) {
  return (
    <Select
      value={selectedChild.id.toString()}
      onValueChange={(value) => {
        if (value === "all") return
        const child = children.find((c) => c.id === Number.parseInt(value))
        if (child) onChildChange(child)
      }}
    >
      <SelectTrigger className="w-64">
        <SelectValue>
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-indigo-600 text-white">{selectedChild.avatar}</AvatarFallback>
            </Avatar>
            <span>{selectedChild.name}</span>
            <Badge variant="secondary" className="text-xs">
              {selectedChild.age} yaş
            </Badge>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {showAll && (
          <SelectItem value="all">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                T
              </div>
              <span>Tüm Çocuklar</span>
            </div>
          </SelectItem>
        )}
        {children.map((child) => (
          <SelectItem key={child.id} value={child.id.toString()}>
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-indigo-600 text-white">{child.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium">{child.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {child.age} yaş
                  </Badge>
                  {child.school && <span className="text-xs text-gray-500">{child.school}</span>}
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
