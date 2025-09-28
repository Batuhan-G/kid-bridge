import { Child } from "@/lib/api"

export interface SidebarProps {
  children: Child[]
  selectedChild: Child | null
  onChildChange: (child: Child) => void
  totalStats: {
    events: number
    messages: number
    expenses: number
  }
  isOpen: boolean
  onToggle: () => void
} 