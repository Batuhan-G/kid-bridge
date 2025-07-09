"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MessageCircle, PieChart } from "lucide-react"

interface Child {
  id: number
  name: string
  age: number
  avatar: string
  stats: {
    upcomingEvents: number
    unreadMessages: number
    monthlyExpenses: number
    lastActivity: string
  }
}

interface MultiChildStatsProps {
  children: Child[]
}

export function MultiChildStats({ children }: MultiChildStatsProps) {
  const totalStats = {
    events: children.reduce((sum, child) => sum + child.stats.upcomingEvents, 0),
    messages: children.reduce((sum, child) => sum + child.stats.unreadMessages, 0),
    expenses: children.reduce((sum, child) => sum + child.stats.monthlyExpenses, 0),
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
                <p className="text-xl font-bold">₺{totalStats.expenses}</p>
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
                    <AvatarFallback className="bg-indigo-600 text-white text-lg">{child.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{child.name}</h3>
                    <p className="text-sm text-gray-600">{child.age} yaşında</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Etkinlik</p>
                    <Badge variant="secondary">{child.stats.upcomingEvents}</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Mesaj</p>
                    <Badge variant={child.stats.unreadMessages > 0 ? "destructive" : "secondary"}>
                      {child.stats.unreadMessages}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Harcama</p>
                    <p className="font-medium">₺{child.stats.monthlyExpenses}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Son Aktivite</p>
                    <p className="text-xs text-gray-500">{child.stats.lastActivity}</p>
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
