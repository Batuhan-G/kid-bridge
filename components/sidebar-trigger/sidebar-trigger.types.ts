export interface SidebarTriggerProps {
  onToggle: () => void
  totalStats: {
    events: number
    messages: number
    expenses: number
  }
} 