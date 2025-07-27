export interface SidebarProps {
  children: Array<{
    id: number
    name: string
    age: number
    avatar: string
    school?: string
  }>
  selectedChild: {
    id: number
    name: string
    age: number
    avatar: string
    school?: string
  }
  onChildChange: (child: any) => void
  totalStats: {
    events: number
    messages: number
    expenses: number
  }
  isOpen: boolean
  onToggle: () => void
} 