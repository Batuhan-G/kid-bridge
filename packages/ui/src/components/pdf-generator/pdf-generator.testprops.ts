import { PDFGeneratorProps } from './pdf-generator.types'

export const pdfGeneratorTestProps: PDFGeneratorProps = {
  child: { id: 1, name: 'Elif', age: 8, avatar: 'E', school: 'Atatürk İlkokulu' },
  developmentData: {
    academic: { current: 90, target: 95, trend: '+3' },
    social: { current: 80, target: 90, trend: '+5' },
  },
  reportMonth: 'Ocak',
  reportYear: '2024',
} 