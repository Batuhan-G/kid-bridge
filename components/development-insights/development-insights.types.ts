export interface DevelopmentInsightsProps {
  child: {
    id: number
    name: string
    age: number
  }
  developmentData: Record<string, { current: number; target: number; trend: string }>
  ageGroup: string
} 