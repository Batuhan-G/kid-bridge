export interface Child {
  id: number
  name: string
  age: number
  avatar: string
  stats: {
    upcomingEvents: number
    unreadMessages: number
    monthlyExpenses: number
    lastActivity: string
  }
}

export interface MultiChildStatsProps {
  children: Child[]
} 