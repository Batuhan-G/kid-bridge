import { DevelopmentInsightsProps } from './development-insights.types'

export const developmentInsightsTestProps: DevelopmentInsightsProps = {
  child: { id: 1, name: 'Elif', age: 8 },
  developmentData: {
    academic: { current: 90, target: 95, trend: '+3' },
    social: { current: 80, target: 90, trend: '+5' },
  },
  ageGroup: 'school-age',
} 