"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"

interface PDFGeneratorProps {
  child: any
  developmentData: any
  reportMonth: string
  reportYear: string
}

export default function PDFGenerator({ child, developmentData, reportMonth, reportYear }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Dinamik import ile jsPDF yükle
      const { jsPDF } = await import("jspdf")

      // PDF oluştur
      const doc = new jsPDF()

      // PDF içeriğini oluştur
      await createPDFContent(doc, child, developmentData, reportMonth, reportYear)

      // PDF'i indir
      const fileName = `${child.name}_Gelisim_Raporu_${reportMonth}_${reportYear}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error("PDF oluşturma hatası:", error)
      alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={generatePDF} disabled={isGenerating} className="flex items-center space-x-2">
      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      <span>{isGenerating ? "Oluşturuluyor..." : "PDF İndir"}</span>
    </Button>
  )
}

// PDF içerik oluşturma fonksiyonu
async function createPDFContent(doc: any, child: any, developmentData: any, reportMonth: string, reportYear: string) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Header
  doc.setFontSize(24)
  doc.setTextColor(79, 70, 229)
  doc.text("OrtakEv", 20, yPosition)

  doc.setFontSize(12)
  doc.setTextColor(107, 114, 128)
  doc.text("Gelişim Raporu", pageWidth - 60, yPosition)
  doc.text(new Date().toLocaleDateString("tr-TR"), pageWidth - 60, yPosition + 10)

  yPosition += 30

  // Title
  doc.setFontSize(20)
  doc.setTextColor(31, 41, 55)
  doc.text("Aylık Gelişim Raporu", 20, yPosition)
  yPosition += 10

  doc.setFontSize(14)
  doc.setTextColor(107, 114, 128)
  doc.text(`${reportMonth} ${reportYear} Dönemi`, 20, yPosition)
  yPosition += 20

  // Child Info
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPosition, pageWidth - 40, 30, "F")

  doc.setFontSize(18)
  doc.setTextColor(31, 41, 55)
  doc.text(child.name, 30, yPosition + 15)

  doc.setFontSize(12)
  doc.setTextColor(107, 114, 128)
  doc.text(`${child.age} yaşında • ${child.school}`, 30, yPosition + 25)

  yPosition += 40

  // Development Scores
  doc.setFontSize(16)
  doc.setTextColor(55, 65, 81)
  doc.text("Gelişim Alanları", 20, yPosition)
  yPosition += 15

  const areas = Object.entries(developmentData)
  const areaNames = {
    academic: "Akademik",
    physical: "Fiziksel",
    social: "Sosyal",
    emotional: "Duygusal",
    cognitive: "Bilişsel",
  }

  areas.forEach(([area, data]: [string, any], index) => {
    const xPos = 20 + (index % 2) * (pageWidth / 2 - 20)
    const yPos = yPosition + Math.floor(index / 2) * 40

    // Area box
    doc.setFillColor(249, 250, 251)
    doc.rect(xPos, yPos, pageWidth / 2 - 30, 35, "F")

    // Area name
    doc.setFontSize(12)
    doc.setTextColor(55, 65, 81)
    doc.text(areaNames[area as keyof typeof areaNames] || area, xPos + 5, yPos + 12)

    // Score
    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229)
    doc.text(`${data.current}%`, xPos + 5, yPos + 25)

    // Target and trend
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text(`Hedef: ${data.target}%`, xPos + 60, yPos + 15)
    doc.text(`Değişim: ${data.trend}`, xPos + 60, yPos + 25)
  })

  yPosition += Math.ceil(areas.length / 2) * 40 + 20

  // AI Insights
  if (yPosition > pageHeight - 60) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(16)
  doc.setTextColor(55, 65, 81)
  doc.text("AI Destekli Öngörüler", 20, yPosition)
  yPosition += 15

  const insights = [
    {
      title: "Güçlü Alanlar",
      text: `${child.name} akademik ve fiziksel gelişim alanlarında yaşıtlarının üzerinde performans gösteriyor.`,
    },
    {
      title: "Gelişim Fırsatları",
      text: "Sosyal beceriler alanında hedefe ulaşmak için ek destek gerekebilir.",
    },
    {
      title: "Öneriler",
      text: "Grup aktiviteleri ve sosyal oyunlar ile sosyal becerilerin geliştirilmesi önerilir.",
    },
  ]

  insights.forEach((insight, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }

    // Insight box
    doc.setFillColor(239, 246, 255)
    doc.rect(20, yPosition, pageWidth - 40, 25, "F")

    // Title
    doc.setFontSize(12)
    doc.setTextColor(30, 64, 175)
    doc.text(insight.title, 25, yPosition + 10)

    // Text
    doc.setFontSize(10)
    doc.setTextColor(31, 41, 55)
    const splitText = doc.splitTextToSize(insight.text, pageWidth - 50)
    doc.text(splitText, 25, yPosition + 18)

    yPosition += 30
  })

  // Footer
  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text(
    `Bu rapor OrtakEv platformu tarafından otomatik olarak oluşturulmuştur. • ${new Date().toLocaleDateString("tr-TR")}`,
    20,
    pageHeight - 20,
  )
}
