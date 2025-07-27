import { MultiChildStatsProps } from './multi-child-stats.types'

export const multiChildStatsTestProps: MultiChildStatsProps = {
  children: [
    {
      id: 1,
      name: 'Elif',
      age: 8,
      avatar: 'E',
      stats: {
        upcomingEvents: 2,
        unreadMessages: 1,
        monthlyExpenses: 500,
        lastActivity: '2 saat önce',
      },
    },
    {
      id: 2,
      name: 'Can',
      age: 12,
      avatar: 'C',
      stats: {
        upcomingEvents: 1,
        unreadMessages: 0,
        monthlyExpenses: 300,
        lastActivity: '5 saat önce',
      },
    },
  ],
} 