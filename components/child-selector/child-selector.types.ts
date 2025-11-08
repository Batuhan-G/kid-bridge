import { Child as ApiChild } from "@/lib/api"

export interface Child {
  id: string
  name: string
  age: number
  avatar: string
  school?: string
}

export interface ChildSelectorProps {
  children: Child[]
  selectedChild: Child | null
  onChildChange: (child: Child) => void
  showAll?: boolean
}

// Helper function to convert API Child to ChildSelector Child
export const mapApiChildToSelector = (apiChild: ApiChild): Child => {
  const birth = new Date(apiChild.dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return {
    id: apiChild.id,
    name: `${apiChild.firstName} ${apiChild.lastName}`,
    age,
    avatar: apiChild.firstName.charAt(0).toUpperCase(),
    school: undefined // Can be added later if needed
  }
} 