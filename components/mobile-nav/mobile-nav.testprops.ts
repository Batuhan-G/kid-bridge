import { MobileNavProps } from './mobile-nav.types'

export const mobileNavTestProps: MobileNavProps = {
  children: [
    { id: 1, name: 'Elif', age: 8, avatar: 'E', stats: { upcomingEvents: 2, unreadMessages: 1, monthlyExpenses: 500 } },
    { id: 2, name: 'Can', age: 12, avatar: 'C', stats: { upcomingEvents: 1, unreadMessages: 0, monthlyExpenses: 300 } },
  ],
  selectedChild: { id: 1, name: 'Elif', age: 8, avatar: 'E' },
  onChildChange: () => {},
  totalStats: { events: 3, messages: 1, expenses: 800 },
} 