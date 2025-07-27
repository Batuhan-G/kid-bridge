export interface Child {
  id: number
  name: string
  age: number
  avatar: string
  unreadCount?: number
}

export interface ChildQuickSwitchProps {
  children: Child[]
  selectedChild: Child
  onChildChange: (child: Child) => void
} 