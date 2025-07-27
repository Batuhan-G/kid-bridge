export interface MobileNavProps {
  children: Array<{
    id: number
    name: string
    age: number
    avatar: string
    stats?: {
      upcomingEvents: number
      unreadMessages: number
      monthlyExpenses: number
    }
  }>
  selectedChild: any
  onChildChange: (child: any) => void
  totalStats?: {
    events: number
    messages: number
    expenses: number
  }
} 