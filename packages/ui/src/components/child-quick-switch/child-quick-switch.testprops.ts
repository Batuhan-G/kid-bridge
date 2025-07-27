import { ChildQuickSwitchProps } from './child-quick-switch.types'

export const childQuickSwitchTestProps: ChildQuickSwitchProps = {
  children: [
    { id: 1, name: 'Elif', age: 8, avatar: 'E', unreadCount: 2 },
    { id: 2, name: 'Can', age: 12, avatar: 'C', unreadCount: 0 },
  ],
  selectedChild: { id: 1, name: 'Elif', age: 8, avatar: 'E', unreadCount: 2 },
  onChildChange: () => {},
} 