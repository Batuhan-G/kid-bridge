"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiChildStats } from "@/components/multi-child-stats/multi-child-stats";
import {
  Calendar,
  MessageCircle,
  Users,
  PieChart,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function MultiChildDashboard() {
  const children = [
    {
      id: 1,
      name: "Elif",
      age: 8,
      avatar: "E",
      stats: {
        upcomingEvents: 3,
        unreadMessages: 1,
        monthlyExpenses: 1200,
        lastActivity: "2 saat önce",
      },
    },
    {
      id: 2,
      name: "Can",
      age: 12,
      avatar: "C",
      stats: {
        upcomingEvents: 2,
        unreadMessages: 2,
        monthlyExpenses: 800,
        lastActivity: "5 saat önce",
      },
    },
    {
      id: 3,
      name: "Zeynep",
      age: 6,
      avatar: "Z",
      stats: {
        upcomingEvents: 1,
        unreadMessages: 0,
        monthlyExpenses: 450,
        lastActivity: "1 gün önce",
      },
    },
  ];

  const recentActivities = [
    {
      id: 1,
      child: "Elif",
      childId: 1,
      type: "event",
      title: "Okul toplantısı eklendi",
      time: "2 saat önce",
      icon: Calendar,
    },
    {
      id: 2,
      child: "Can",
      childId: 2,
      type: "message",
      title: "Yeni mesaj alındı",
      time: "3 saat önce",
      icon: MessageCircle,
    },
    {
      id: 3,
      child: "Zeynep",
      childId: 3,
      type: "expense",
      title: "Anaokulu ücreti eklendi",
      time: "5 saat önce",
      icon: PieChart,
    },
  ];

  const weeklyComparison = [
    { child: "Elif", thisWeek: 5, lastWeek: 3, change: "+2" },
    { child: "Can", thisWeek: 4, lastWeek: 6, change: "-2" },
    { child: "Zeynep", thisWeek: 2, lastWeek: 2, change: "0" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Ana Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  Çoklu Çocuk Görünümü
                </h1>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {children.length} Çocuk
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tüm Çocuklarınız İçin Özet
          </h1>
          <p className="text-gray-600">
            Elif, Can ve Zeynep için güncel durum ve aktiviteler
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="activities">Aktiviteler</TabsTrigger>
            <TabsTrigger value="comparison">Karşılaştırma</TabsTrigger>
            <TabsTrigger value="insights">AI Öngörüler</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <MultiChildStats children={children} />
          </TabsContent>

          <TabsContent value="activities">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Son Aktiviteler</CardTitle>
                  <CardDescription>
                    Tüm çocuklar için son hareketler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">
                                {activity.title}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {activity.child}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bugünkü Etkinlikler</CardTitle>
                  <CardDescription>
                    Tüm çocuklar için bugün planlanmış
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Okul Toplantısı</p>
                        <p className="text-sm text-gray-600">14:00 - Elif</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Okul</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Basketbol Antrenmanı</p>
                        <p className="text-sm text-gray-600">16:00 - Can</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Spor
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">Oyun Saati</p>
                        <p className="text-sm text-gray-600">15:30 - Zeynep</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Sosyal
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Haftalık Aktivite Karşılaştırması</CardTitle>
                  <CardDescription>Bu hafta vs geçen hafta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyComparison.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-indigo-600 text-white">
                              {item.child[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{item.child}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Bu Hafta</p>
                            <p className="font-bold">{item.thisWeek}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Geçen Hafta</p>
                            <p className="font-bold">{item.lastWeek}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Değişim</p>
                            <p
                              className={`font-bold ${
                                item.change.startsWith("+")
                                  ? "text-green-600"
                                  : item.change.startsWith("-")
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {item.change}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aylık Harcama Dağılımı</CardTitle>
                  <CardDescription>
                    Çocuk başına harcama oranları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {children.map((child) => {
                      const totalExpenses = children.reduce(
                        (sum, c) => sum + c.stats.monthlyExpenses,
                        0
                      );
                      const percentage = (
                        (child.stats.monthlyExpenses / totalExpenses) *
                        100
                      ).toFixed(1);

                      return (
                        <div key={child.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-indigo-600 text-white">
                                  {child.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{child.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                ₺{child.stats.monthlyExpenses}
                              </p>
                              <p className="text-xs text-gray-600">
                                %{percentage}
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-indigo-600"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>AI Öngörüler</CardTitle>
                  <CardDescription>
                    Çocuklarınız için akıllı öneriler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Elif için Öneri
                      </h4>
                      <p className="text-sm text-blue-800">
                        Matematik notlarındaki gelişim devam ediyor. Bu ay 2 ek
                        çalışma seansı planlanabilir.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">
                        Can için Öneri
                      </h4>
                      <p className="text-sm text-green-800">
                        Spor aktivitelerindeki başarısı akademik motivasyonunu
                        da artırıyor. Dengeli program sürdürülmeli.
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">
                        Zeynep için Öneri
                      </h4>
                      <p className="text-sm text-yellow-800">
                        Sosyal gelişimi çok iyi. Yaratıcı aktiviteler
                        eklenebilir.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trend Analizi</CardTitle>
                  <CardDescription>Son 3 aydaki gelişimler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Genel Aktivite</p>
                        <p className="text-sm text-gray-600">Tüm çocuklar</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">+15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">İletişim Kalitesi</p>
                        <p className="text-sm text-gray-600">AI skorlaması</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">+22%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Planlama Verimliliği</p>
                        <p className="text-sm text-gray-600">
                          Etkinlik başarı oranı
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">+8%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
