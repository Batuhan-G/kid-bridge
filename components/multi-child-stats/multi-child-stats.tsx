"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MessageCircle, PieChart } from "lucide-react"
import type { MultiChildStatsProps } from './multi-child-stats.types'

export function MultiChildStats({ children }: MultiChildStatsProps) {
  // Calculate child age helper
  const calculateChildAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const totalStats = {
    events: children.reduce((sum, child) => sum + (child._count?.activities || 0), 0),
    messages: children.reduce((sum, child) => sum + (child._count?.messages || 0), 0),
    expenses: children.reduce((sum, child) => sum + (child._count?.expenses || 0), 0),
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Toplam Etkinlik</p>
                <p className="text-xl font-bold">{totalStats.events}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Okunmamış Mesaj</p>
                <p className="text-xl font-bold">{totalStats.messages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Toplam Harcama</p>
                <p className="text-xl font-bold">{totalStats.expenses} Adet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Child Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Çocuk Bazlı Özet</CardTitle>
          <CardDescription>Her çocuk için güncel durum</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {children.map((child) => (
              <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-indigo-600 text-white text-lg">
                      {child.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{child.firstName} {child.lastName}</h3>
                    <p className="text-sm text-gray-600">{calculateChildAge(child.dateOfBirth)} yaşında</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Etkinlik</p>
                    <Badge variant="secondary">{child._count?.activities || 0}</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Mesaj</p>
                    <Badge variant={(child._count?.messages || 0) > 0 ? "destructive" : "secondary"}>
                      {child._count?.messages || 0}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Harcama</p>
                    <p className="font-medium">{child._count?.expenses || 0} Adet</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Son Güncelleme</p>
                    <p className="text-xs text-gray-500">
                      {new Date(child.updatedAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
