export interface DevelopmentPDFReportProps {
  child: {
    id: number
    name: string
    age: number
    avatar: string
    school: string
    ageGroup: string
  }
  developmentData: Record<string, { current: number; target: number; trend: string }>
  reportMonth: string
  reportYear: string
} 