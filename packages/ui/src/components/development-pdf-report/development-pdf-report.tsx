"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import type { DevelopmentPDFReportProps } from './development-pdf-report.types'

export function DevelopmentPDFReport({ child, developmentData }: DevelopmentPDFReportProps) {
  const [selectedMonth, setSelectedMonth] = useState("Ocak")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [isGenerating, setIsGenerating] = useState(false)

  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ]

  const years = ["2024", "2023", "2022"]

  // Basitleştirilmiş PDF oluşturma
  const generateSimplePDFReport = async () => {
    setIsGenerating(true)

    try {
      // Basit PDF içeriği oluştur
      const content = createSimplePDFContent(child, developmentData, selectedMonth, selectedYear)

      // Basit indirme simülasyonu
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${child.name}_Gelisim_Raporu_${selectedMonth}_${selectedYear}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Rapor oluşturma hatası:", error)
      alert("Rapor oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Basit Rapor Oluştur</span>
        </CardTitle>
        <CardDescription>{child.name} için aylık gelişim raporunu indirin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Rapor Dönemi Seçimi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rapor Ayı</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Rapor Yılı</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Basit Rapor İçeriği */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Rapor İçeriği:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Gelişim skorları</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Kilometre taşları</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Basit öneriler</span>
              </div>
            </div>
          </div>

          {/* Aksiyon Butonu */}
          <Button onClick={generateSimplePDFReport} disabled={isGenerating} className="w-full">
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            <span>{isGenerating ? "Oluşturuluyor..." : "Basit Rapor İndir"}</span>
          </Button>

          {/* Son Raporlar */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Son Raporlar:</h4>
            <div className="space-y-2">
              {["Aralık 2023", "Kasım 2023", "Ekim 2023"].map((period) => (
                <div key={period} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">
                    {child.name} - {period}
                  </span>
                  <Button variant="ghost" size="sm" onClick={generateSimplePDFReport}>
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Basit PDF içerik oluşturma
function createSimplePDFContent(child: any, developmentData: any, reportMonth: string, reportYear: string): string {
  const areaNames = {
    academic: "Akademik",
    physical: "Fiziksel",
    social: "Sosyal",
    emotional: "Duygusal",
    cognitive: "Bilişsel",
  }

  let content = `
ORTAKEV GELİŞİM RAPORU
${reportMonth} ${reportYear}

ÇOCUK BİLGİLERİ:
Ad: ${child.name}
Yaş: ${child.age}
Okul: ${child.school}

GELİŞİM SKORLARI:
`

  Object.entries(developmentData).forEach(([area, data]: [string, any]) => {
    const areaName = areaNames[area as keyof typeof areaNames] || area
    content += `${areaName}: ${data.current}% (Hedef: ${data.target}%, Değişim: ${data.trend})\n`
  })

  const overallScore =
    Object.values(developmentData).reduce((sum: number, data: any) => sum + data.current, 0) /
    Object.values(developmentData).length

  content += `
GENEL DEĞERLENDİRME:
Genel Gelişim Skoru: ${overallScore.toFixed(0)}%

ÖNERİLER:
- Günlük okuma rutini oluşturun
- Fiziksel aktiviteleri artırın  
- Sosyal oyunları destekleyin
- Duygusal gelişimi takip edin

Bu rapor OrtakEv platformu tarafından oluşturulmuştur.
Tarih: ${new Date().toLocaleDateString("tr-TR")}
`

  return content
}
