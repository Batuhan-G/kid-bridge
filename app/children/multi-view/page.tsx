"use client";
import { useState, useEffect } from "react";
import { AuthGuard } from "@/lib/auth-guard";
import { api, type Child } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
  TrendingUp,
  Home,
  LayoutGrid,
  List,
  Plus,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/sidebar-trigger/sidebar-trigger";
import { Sidebar } from "@/components/sidebar/sidebar";
import Link from "next/link";

function MultiChildDashboardContent() {
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)

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

  // Load children on mount
  useEffect(() => {
    loadChildren()
  }, [])

  // Select first child when children are loaded
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0])
    }
  }, [children, selectedChild])

  // Load children from API
  const loadChildren = async () => {
    setLoadingChildren(true)
    try {
      const response = await api.getChildren()
      if (response.data) {
        setChildren(response.data)
      } else {
        toast({
          title: "Hata",
          description: response.error || "Çocuklar yüklenemedi",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çocuklar yüklenemedi",
        variant: "destructive"
      })
    } finally {
      setLoadingChildren(false)
    }
  }
  
  const totalStats = {
    events: 0, // Will be implemented with calendar feature
    messages: children.reduce((sum, child) => sum + (child._count?.messages || 0), 0),
    expenses: children.reduce((sum, child) => sum + (child._count?.expenses || 0), 0),
  }

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

  // Generate weekly comparison data based on real children
  const weeklyComparison = children.map((child) => ({
    child: `${child.firstName} ${child.lastName}`,
    firstName: child.firstName,
    thisWeek: child._count?.activities || 0,
    lastWeek: Math.max(0, (child._count?.activities || 0) - Math.floor(Math.random() * 3)),
    change: "0", // Will be calculated
  })).map((item) => ({
    ...item,
    change: item.thisWeek > item.lastWeek 
      ? `+${item.thisWeek - item.lastWeek}`
      : item.thisWeek < item.lastWeek
      ? `-${item.lastWeek - item.thisWeek}`
      : "0"
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Sidebar Trigger */}
              <SidebarTrigger
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                totalStats={totalStats}
              />

              {/* Logo and KidBridge - hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center justify-center">
                  <img
                    src="/kid-bridge-logo1.png"
                    alt="KidBridge Logo"
                    className="w-12 h-12 flex-shrink-0"/>
                </div>
                <span className="text-xl font-bold text-gray-900 whitespace-nowrap">KidBridge</span>
              </div>
              
              {/* Breadcrumb Navigation - hidden on mobile */}
              <div className="hidden md:block">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href="/dashboard" className="flex items-center space-x-1">
                          <Home className="w-4 h-4" />
                          <span>Ana Sayfa</span>
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Çoklu Görünüm</span>
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* View Toggle Buttons */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Link href="/children">
                  <Button variant="ghost" size="sm" className="rounded-none border-r">
                    <List className="w-4 h-4 mr-1" />
                    Liste
                  </Button>
                </Link>
                <Link href="/children/multi-view">
                  <Button variant="ghost" size="sm" className="rounded-none bg-indigo-50 text-indigo-600">
                    <LayoutGrid className="w-4 h-4 mr-1" />
                    Çoklu
                  </Button>
                </Link>
              </div>
              
              <Badge variant="secondary" className="px-3 py-1">
                {children.length} Çocuk
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <Sidebar
        children={children}
        selectedChild={selectedChild}
        onChildChange={setSelectedChild}
        totalStats={totalStats}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tüm Çocuklarınız İçin Özet
          </h1>
          <p className="text-gray-600">
            {children.length > 0 
              ? `${children.map(child => `${child.firstName}`).join(', ')} için güncel durum ve aktiviteler`
              : 'Henüz çocuk kaydı bulunmuyor'
            }
          </p>
        </div>

        {loadingChildren ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Çocuklar yükleniyor...</p>
            </div>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz çocuk kaydı yok</h3>
            <p className="text-gray-600 mb-4">Çocuk ekleyerek başlayın</p>
            <Link href="/children">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Çocuk Ekle
              </Button>
            </Link>
          </div>
        ) : (
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
                              {item.firstName.charAt(0).toUpperCase()}
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
                      const expenseCount = child._count?.expenses || 0;
                      const totalExpenseCount = children.reduce(
                        (sum, c) => sum + (c._count?.expenses || 0),
                        0
                      );
                      const percentage = totalExpenseCount > 0 
                        ? ((expenseCount / totalExpenseCount) * 100).toFixed(1)
                        : "0";

                      return (
                        <div key={child.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-indigo-600 text-white">
                                  {child.firstName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{child.firstName} {child.lastName}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                {expenseCount} Harcama
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
        )}
      </div>
    </div>
  );
}

export default function MultiChildDashboard() {
  return (
    <AuthGuard>
      <MultiChildDashboardContent />
    </AuthGuard>
  );
}
