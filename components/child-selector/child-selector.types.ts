export interface Child {
  id: number
  name: string
  age: number
  avatar: string
  school?: string
}

export interface ChildSelectorProps {
  children: Child[]
  selectedChild: Child
  onChildChange: (child: Child) => void
  showAll?: boolean
} 