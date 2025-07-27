import { ChildSelectorProps } from './child-selector.types'

export const childSelectorTestProps: ChildSelectorProps = {
  children: [
    { id: 1, name: 'Elif', age: 8, avatar: 'E', school: 'Atatürk İlkokulu' },
    { id: 2, name: 'Can', age: 12, avatar: 'C', school: 'Gazi Ortaokulu' },
  ],
  selectedChild: { id: 1, name: 'Elif', age: 8, avatar: 'E', school: 'Atatürk İlkokulu' },
  onChildChange: () => {},
  showAll: true,
} 