"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, CheckCircle, Target, Lightbulb } from "lucide-react"

interface DevelopmentInsightsProps {
  child: {
    id: number
    name: string
    age: number
  }
  developmentData: Record<string, { current: number; target: number; trend: string }>
  ageGroup: string
}

export function DevelopmentInsights({ child, developmentData, ageGroup }: DevelopmentInsightsProps) {
  // Basit trend analizi
  const getBasicInsights = () => {
    const insights = []

    // Güçlü alanları tespit et
    const strongAreas = Object.entries(developmentData)
      .filter(([_, data]) => data.current >= 85)
      .map(([area, _]) => getAreaName(area))

    // Gelişim gereken alanları tespit et
    const improvementAreas = Object.entries(developmentData)
      .filter(([_, data]) => data.current < data.target - 5)
      .map(([area, _]) => getAreaName(area))

    // Hızlı gelişen alanları tespit et
    const rapidGrowthAreas = Object.entries(developmentData)
      .filter(([_, data]) => Number.parseInt(data.trend.replace("+", "")) > 5)
      .map(([area, _]) => getAreaName(area))

    if (strongAreas.length > 0) {
      insights.push({
        type: "strength",
        icon: CheckCircle,
        title: "Güçlü Alanlar",
        description: `${strongAreas.join(", ")} alanlarında yaşıtlarının üzerinde performans gösteriyor.`,
        color: "bg-green-50 text-green-800 border-green-200",
      })
    }

    if (improvementAreas.length > 0) {
      insights.push({
        type: "improvement",
        icon: Target,
        title: "Gelişim Fırsatları",
        description: `${improvementAreas.join(", ")} alanlarında hedefe ulaşmak için ek destek gerekebilir.`,
        color: "bg-yellow-50 text-yellow-800 border-yellow-200",
      })
    }

    if (rapidGrowthAreas.length > 0) {
      insights.push({
        type: "growth",
        icon: TrendingUp,
        title: "Hızlı Gelişim",
        description: `${rapidGrowthAreas.join(", ")} alanlarında son dönemde hızlı ilerleme kaydedildi.`,
        color: "bg-blue-50 text-blue-800 border-blue-200",
      })
    }

    return insights
  }

  // Basit öneriler
  const getSimpleRecommendations = () => {
    const recommendations = {
      preschool: [
        {
          area: "Günlük Aktiviteler",
          activities: ["Hikaye okuma", "Boyama", "Basit oyunlar", "Şarkı söyleme"],
          duration: "15-20 dakika",
        },
        {
          area: "Sosyal Gelişim",
          activities: ["Arkadaşlarla oyun", "Paylaşma aktiviteleri", "Grup oyunları"],
          duration: "30 dakika",
        },
      ],
      "school-age": [
        {
          area: "Akademik Destek",
          activities: ["Günlük okuma", "Matematik oyunları", "Ödev zamanı", "Bilim deneyleri"],
          duration: "30-45 dakika",
        },
        {
          area: "Fiziksel Aktivite",
          activities: ["Spor", "Bisiklet", "Yürüyüş", "Oyun parkı"],
          duration: "60 dakika",
        },
      ],
      "pre-teen": [
        {
          area: "Akademik Başarı",
          activities: ["Proje çalışmaları", "Grup çalışmaları", "Sunum hazırlama"],
          duration: "45-60 dakika",
        },
        {
          area: "Sosyal Beceriler",
          activities: ["Takım sporları", "Kulüp aktiviteleri", "Arkadaş buluşmaları"],
          duration: "60-90 dakika",
        },
      ],
    }
    return recommendations[ageGroup as keyof typeof recommendations] || recommendations["school-age"]
  }

  const insights = getBasicInsights()
  const recommendations = getSimpleRecommendations()

  // Genel gelişim skoru
  const overallScore =
    Object.values(developmentData).reduce((sum, data) => sum + data.current, 0) / Object.keys(developmentData).length

  return (
    <div className="space-y-6">
      {/* Genel Değerlendirme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Gelişim Özeti</span>
          </CardTitle>
          <CardDescription>{child.name} için genel durum değerlendirmesi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Genel Gelişim Skoru</span>
              <div className="flex items-center space-x-2">
                <Progress value={overallScore} className="w-32 h-3" />
                <span className="text-2xl font-bold text-indigo-600">{overallScore.toFixed(0)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {Object.values(developmentData).filter((d) => d.current >= 85).length}
                </p>
                <p className="text-sm text-green-800">Güçlü Alan</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {Object.values(developmentData).filter((d) => d.current < d.target - 5).length}
                </p>
                <p className="text-sm text-yellow-800">Gelişim Fırsatı</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {Object.values(developmentData).filter((d) => Number.parseInt(d.trend.replace("+", "")) > 5).length}
                </p>
                <p className="text-sm text-blue-800">Hızlı Gelişim</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basit Öngörüler */}
      <div className="grid gap-4">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon
          return (
            <Card key={index} className={`border-l-4 ${insight.color}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <IconComponent className="w-6 h-6 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{insight.title}</h3>
                    <p className="text-sm">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Basit Öneriler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span>Önerilen Aktiviteler</span>
          </CardTitle>
          <CardDescription>Yaş grubuna uygun basit aktiviteler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{rec.area}</h3>
                  <span className="text-sm text-gray-600">⏱️ {rec.duration}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {rec.activities.map((activity, actIndex) => (
                    <Badge key={actIndex} variant="secondary" className="justify-center py-2">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Basit Gelecek Tahmini */}
      <Card>
        <CardHeader>
          <CardTitle>3 Aylık Basit Projeksiyon</CardTitle>
          <CardDescription>Mevcut trend devam ederse beklenen durum</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(developmentData).map(([area, data]) => {
              const trendValue = Number.parseInt(data.trend.replace("+", ""))
              const projectedValue = Math.min(data.current + trendValue * 3, 100)

              return (
                <div key={area} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium capitalize">{getAreaName(area)}</span>
                    <p className="text-sm text-gray-600">
                      Mevcut: {data.current}% → Tahmini: {projectedValue}%
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={projectedValue} className="w-24 h-2" />
                    <Badge variant={projectedValue >= data.target ? "default" : "secondary"}>
                      {projectedValue >= data.target ? "Hedefe Ulaşır" : "Ek Destek"}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Yardımcı fonksiyon
function getAreaName(area: string) {
  const names = {
    academic: "Akademik",
    physical: "Fiziksel",
    social: "Sosyal",
    emotional: "Duygusal",
    cognitive: "Bilişsel",
  }
  return names[area as keyof typeof names] || area
}
