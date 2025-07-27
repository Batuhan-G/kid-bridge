"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Clock, Star } from "lucide-react"
import type { MilestoneTrackerProps } from './milestone-tracker.types'

export function MilestoneTracker({ child, ageGroup }: MilestoneTrackerProps) {
  // Basitleştirilmiş kilometre taşları
  const getMilestones = (ageGroup: string, age: number) => {
    const milestones = {
      preschool: [
        {
          id: 1,
          title: "Kendi adını yazabilir",
          category: "Bilişsel",
          status: "completed",
          targetAge: 5,
        },
        {
          id: 2,
          title: "10'a kadar sayabilir",
          category: "Bilişsel",
          status: "completed",
          targetAge: 5,
        },
        {
          id: 3,
          title: "Arkadaşlarıyla oyun oynayabilir",
          category: "Sosyal",
          status: "completed",
          targetAge: 5,
        },
        {
          id: 4,
          title: "Duygularını ifade edebilir",
          category: "Duygusal",
          status: "in-progress",
          targetAge: 6,
        },
        {
          id: 5,
          title: "Bağımsız tuvalet kullanımı",
          category: "Fiziksel",
          status: "completed",
          targetAge: 4,
        },
      ],
      "school-age": [
        { id: 1, title: "Akıcı okuma", category: "Akademik", status: "completed", targetAge: 7 },
        { id: 2, title: "Temel matematik işlemleri", category: "Akademik", status: "completed", targetAge: 8 },
        { id: 3, title: "Bisiklet kullanabilir", category: "Fiziksel", status: "completed", targetAge: 7 },
        { id: 4, title: "Grup çalışması yapabilir", category: "Sosyal", status: "in-progress", targetAge: 8 },
        { id: 5, title: "Sorumluluk alabilir", category: "Duygusal", status: "in-progress", targetAge: 9 },
      ],
      "pre-teen": [
        { id: 1, title: "Soyut düşünme", category: "Bilişsel", status: "completed", targetAge: 11 },
        { id: 2, title: "Karmaşık projeler yapabilir", category: "Akademik", status: "in-progress", targetAge: 12 },
        { id: 3, title: "Empati kurabilir", category: "Duygusal", status: "completed", targetAge: 10 },
        { id: 4, title: "Liderlik becerileri", category: "Sosyal", status: "in-progress", targetAge: 13 },
        { id: 5, title: "Spor koordinasyonu", category: "Fiziksel", status: "completed", targetAge: 11 },
      ],
    }
    return milestones[ageGroup as keyof typeof milestones] || milestones["school-age"]
  }

  const milestones = getMilestones(ageGroup, child.age)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Akademik":
        return "bg-blue-100 text-blue-800"
      case "Fiziksel":
        return "bg-red-100 text-red-800"
      case "Sosyal":
        return "bg-green-100 text-green-800"
      case "Duygusal":
        return "bg-purple-100 text-purple-800"
      case "Bilişsel":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedCount = milestones.filter((m) => m.status === "completed").length
  const totalCount = milestones.length
  const progressPercentage = (completedCount / totalCount) * 100

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Kilometre Taşları</span>
          </CardTitle>
          <CardDescription>{child.name} için yaş grubuna uygun gelişim hedefleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Genel İlerleme</span>
              <span className="text-sm text-gray-600">
                {completedCount}/{totalCount} tamamlandı
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">%{progressPercentage.toFixed(0)} tamamlandı</span>
              <span className="text-gray-600">{child.age} yaşında</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basitleştirilmiş Milestones List */}
      <div className="grid gap-4">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1">{getStatusIcon(milestone.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(milestone.category)}>{milestone.category}</Badge>
                      <Badge variant="outline" className={getStatusColor(milestone.status)}>
                        {milestone.status === "completed"
                          ? "Tamamlandı"
                          : milestone.status === "in-progress"
                            ? "Devam Ediyor"
                            : "Yaklaşan"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Hedef Yaş: {milestone.targetAge}</span>
                    {milestone.status === "completed" && (
                      <Badge className="bg-green-100 text-green-800">Başarıyla Tamamlandı</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Basit Öneriler */}
      <Card>
        <CardHeader>
          <CardTitle>Basit Öneriler</CardTitle>
          <CardDescription>{child.age} yaş için gelişim destekleme önerileri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ageGroup === "preschool" && (
              <>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">🎨 Yaratıcı aktiviteler: Boyama ve hikaye anlatma</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">🤝 Sosyal oyunlar: Arkadaşlarıyla paylaşma</p>
                </div>
              </>
            )}

            {ageGroup === "school-age" && (
              <>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">📚 Günlük okuma: 20-30 dakika okuma rutini</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">⚽ Fiziksel aktiviteler: Spor ve hareket</p>
                </div>
              </>
            )}

            {ageGroup === "pre-teen" && (
              <>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">🧠 Problem çözme: Karmaşık projeler</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">💭 Duygusal destek: Kimlik arayışı normaldir</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
