import { SidebarProps } from './sidebar.types'

export const sidebarTestProps: SidebarProps = {
  children: [
    { id: 1, name: 'Elif', age: 8, avatar: 'E', school: 'Atatürk İlkokulu' },
    { id: 2, name: 'Can', age: 12, avatar: 'C', school: 'Gazi Ortaokulu' },
  ],
  selectedChild: { id: 1, name: 'Elif', age: 8, avatar: 'E', school: 'Atatürk İlkokulu' },
  onChildChange: () => {},
  totalStats: { events: 2, messages: 1, expenses: 500 },
  isOpen: true,
  onToggle: () => {},
} 