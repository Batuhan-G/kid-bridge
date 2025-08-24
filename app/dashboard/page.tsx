"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/lib/auth-guard";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageCircle,
  Users,
  PieChart,
  Plus,
  Bell,
  TrendingUp,
  Clock,
  AlertCircle,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/sidebar-trigger/sidebar-trigger";
import { Sidebar } from "@/components/sidebar/sidebar";
import { PendingInvitations } from "@/components/pending-invitations/pending-invitations";

interface Child {
  id: number;
  name: string;
  age: number;
  avatar: string;
  stats: {
    upcomingEvents: number;
    unreadMessages: number;
    monthlyExpenses: number;
  };
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  responsible: string;
  type: string;
}

interface Message {
  id: number;
  from: string;
  message: string;
  time: string;
  unread: boolean;
}


function DashboardContent() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [children] = useState<Child[]>([
    {
      id: 1,
      name: "Elif",
      age: 8,
      avatar: "E",
      stats: {
        upcomingEvents: 3,
        unreadMessages: 1,
        monthlyExpenses: 1200,
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
      },
    },
  ]);

  const [selectedChild, setSelectedChild] = useState(children[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [invitationCount, setInvitationCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  
  // Calculate actual notification count excluding invitations (which are handled separately)
  const actualNotificationCount = notifications.filter((notification: any) => 
    notification.type !== "INVITATION_RECEIVED" && !notification.isRead
  ).length;
  const [processingNotifications, setProcessingNotifications] = useState<Set<string>>(new Set());


  // Fetch notifications - only when user is authenticated
  useEffect(() => {
    if (!user || authLoading) return;
    
    const fetchNotifications = async () => {
      try {
        const result = await api.getNotifications();
        if (!result.error && result.data) {
          setNotifications(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const result = await api.getUnreadNotificationCount();
        if (!result.error && result.data) {
          setUnreadNotificationCount(result.data.count || 0);
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchNotifications();
    fetchUnreadCount();
  }, [user, authLoading]);

  // Fetch initial invitation count - only when user is authenticated
  useEffect(() => {
    if (!user || authLoading) return;
    
    const fetchInitialInvitationCount = async () => {
      try {
        const result = await api.getPendingConnections();
        if (!result.error && result.data) {
          setInvitationCount(result.data.length);
        }
      } catch (error) {
        console.error('Failed to fetch initial invitation count:', error);
      }
    };

    fetchInitialInvitationCount();
  }, [user, authLoading]);

  // Notification action handlers
  const handleAcceptNotification = async (notificationId: string) => {
    setProcessingNotifications(prev => new Set(prev).add(notificationId));
    
    try {
      const result = await api.acceptConnectionFromNotification(notificationId);
      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Co-parent bağlantısı kabul edildi",
        });
        // Refresh notifications and invitations
        const notificationResult = await api.getNotifications();
        if (!notificationResult.error && notificationResult.data) {
          setNotifications(notificationResult.data);
        }
        const invitationResult = await api.getPendingConnections();
        if (!invitationResult.error && invitationResult.data) {
          setInvitationCount(invitationResult.data.length);
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setProcessingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleRejectNotification = async (notificationId: string) => {
    setProcessingNotifications(prev => new Set(prev).add(notificationId));
    
    try {
      const result = await api.rejectConnectionFromNotification(notificationId);
      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Davet Reddedildi",
          description: "Co-parent daveti reddedildi",
        });
        // Refresh notifications and invitations
        const notificationResult = await api.getNotifications();
        if (!notificationResult.error && notificationResult.data) {
          setNotifications(notificationResult.data);
        }
        const invitationResult = await api.getPendingConnections();
        if (!invitationResult.error && invitationResult.data) {
          setInvitationCount(invitationResult.data.length);
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setProcessingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const [upcomingEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Okul Toplantısı",
      date: "15 Ocak",
      time: "14:00",
      responsible: "Anne",
      type: "okul",
    },
    {
      id: 2,
      title: "Doktor Randevusu",
      date: "18 Ocak",
      time: "10:30",
      responsible: "Baba",
      type: "sağlık",
    },
    {
      id: 3,
      title: "Doğum Günü Partisi",
      date: "22 Ocak",
      time: "15:00",
      responsible: "Anne",
      type: "sosyal",
    },
  ]);

  const [recentMessages, setRecentMessages] = useState<Message[]>([
    {
      id: 1,
      from: "Ayşe",
      message: "Okul toplantısı için hazırlık yapalım",
      time: "2 saat önce",
      unread: false,
    },
    {
      id: 2,
      from: "Mehmet",
      message: "Doktor raporu eklendi",
      time: "5 saat önce",
      unread: true,
    },
  ]);

  const monthlyExpenses = {
    total: 2450,
    yourShare: 1225,
    categories: [
      { name: "Okul", amount: 800, color: "bg-blue-500" },
      { name: "Sağlık", amount: 650, color: "bg-red-500" },
      { name: "Aktiviteler", amount: 500, color: "bg-green-500" },
      { name: "Diğer", amount: 500, color: "bg-yellow-500" },
    ],
  };

  const totalStats = {
    events: children.reduce(
      (sum, child) => sum + child.stats.upcomingEvents,
      0
    ),
    messages: 0, // Will be replaced with real message count later
    expenses: children.reduce(
      (sum, child) => sum + child.stats.monthlyExpenses,
      0
    ),
  };

  const handleMarkMessageAsRead = (messageId: number) => {
    setRecentMessages((messages) =>
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, unread: false } : msg
      )
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "okul":
        return "bg-blue-100 text-blue-800";
      case "sağlık":
        return "bg-red-100 text-red-800";
      case "sosyal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center">
                  <img
                    src="/kid-bridge-logo1.png"
                    alt="KidBridge Logo"
                    className="w-12 h-12"/>
                </div>
                <span className="text-xl font-bold text-gray-900">KidBridge</span>
              </div>
            </div>

            {/* Navigation - hide on mobile/tablet, show on desktop (768px+) */}
            <div className="hidden md:flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      {(actualNotificationCount > 0 || invitationCount > 0) && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {actualNotificationCount + invitationCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 mr-4" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Bildirimler</h3>
                        </div>
                        {/* Show delete button only if there are non-invitation notifications */}
                        {notifications.filter((notification: any) => notification.type !== "INVITATION_RECEIVED").length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                await api.deleteAllNotifications();
                                setNotifications([]);
                                setUnreadNotificationCount(0);
                                // Don't touch invitationCount - pending invitations should remain
                                toast({
                                  title: "Başarılı",
                                  description: "Bildirimler silindi (Bekleyen davetler korundu)",
                                });
                              } catch (error) {
                                toast({
                                  title: "Hata",
                                  description: "Bildirimler silinirken hata oluştu",
                                  variant: "destructive",
                                });
                              }
                            }}
                            title="Tüm bildirimleri sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Real notifications (excluding invitations which are handled separately) */}
                      {notifications.filter((notification: any) => notification.type !== "INVITATION_RECEIVED").length > 0 && (
                        <div>
                          <div className="space-y-2">
                            {notifications
                              .filter((notification: any) => notification.type !== "INVITATION_RECEIVED") // Filter out invitation notifications - they are handled by PendingInvitations
                              .map((notification: any) => {
                              // Determine notification color based on type
                              let bgColor = "bg-gray-50";
                              let borderColor = "";
                              
                              if (notification.type === "CONNECTION_ACCEPTED" || notification.type === "CONNECTION_ACCEPTED_BY_ME") {
                                bgColor = "bg-green-50";
                                borderColor = "border-l-4 border-l-green-500";
                              } else if (notification.type === "CONNECTION_REJECTED" || notification.type === "CONNECTION_REJECTED_BY_ME" || notification.type === "CONNECTION_REMOVED" || notification.type === "CONNECTION_REMOVED_BY_ME") {
                                bgColor = "bg-yellow-50";
                                borderColor = "border-l-4 border-l-yellow-500";
                              } else if (notification.type === "INVITATION_SENT") {
                                bgColor = "bg-blue-50";
                                borderColor = "border-l-4 border-l-blue-500";
                              }
                              
                              return (
                              <div key={notification.id} className={`p-3 ${bgColor} rounded-lg ${borderColor}`}>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-sm">{notification.title}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                      {new Date(notification.createdAt).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                  {/* Action buttons for actionable notifications */}
                                  {notification.actionable && notification.type === 'INVITATION_RECEIVED' && !notification.isRead && (
                                    <div className="flex items-center space-x-2 ml-3">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRejectNotification(notification.id)}
                                        disabled={processingNotifications.has(notification.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        {processingNotifications.has(notification.id) ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <X className="w-3 h-3" />
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleAcceptNotification(notification.id)}
                                        disabled={processingNotifications.has(notification.id)}
                                      >
                                        {processingNotifications.has(notification.id) ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Check className="w-3 h-3" />
                                        )}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Co-parent invitations section - only show if there are pending invitations */}
                      {invitationCount > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">Co-Parent Daveti</h4>
                          <PendingInvitations onCountUpdate={setInvitationCount} />
                        </div>
                      )}
                      
                      {/* Empty state when no notifications or invitations */}
                      {notifications.filter((notification: any) => notification.type !== "INVITATION_RECEIVED").length === 0 && invitationCount === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">Henüz bildiriminiz yok</p>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Select
                value={selectedChild.id.toString()}
                onValueChange={(value) =>
                  setSelectedChild(
                    children.find((c) => c.id === Number.parseInt(value)) ||
                      children[0]
                  )
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">
                        {selectedChild.avatar}
                      </div>
                      <span>
                        {selectedChild.name} ({selectedChild.age} yaş)
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">
                          {child.avatar}
                        </div>
                        <span>
                          {child.name} ({child.age} yaş)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           
            </div>

            {/* Mobile: empty div to maintain layout */}
            <div className="sm:hidden"></div>
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

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Hoş geldiniz, {user?.firstName || 'Kullanıcı'}
          </h1>
          <p className="text-gray-600">
            {selectedChild.name} için bugün {selectedChild.stats.upcomingEvents}{" "}
            etkinlik planlanmış
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Toplam Etkinlik</p>
                  <p className="text-2xl font-bold">{totalStats.events}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Okunmamış Mesaj</p>
                  <p className="text-2xl font-bold">{totalStats.messages}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Aylık Harcama</p>
                  <p className="text-2xl font-bold">₺{totalStats.expenses}</p>
                </div>
                <PieChart className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Link href="/calendar">
            <Card className="hover:shadow-md cursor-pointer">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="font-medium text-sm">Takvim</p>
                <p className="text-xs text-gray-500">
                  {selectedChild.stats.upcomingEvents} etkinlik
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105 relative">
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="font-medium text-sm">Mesajlar</p>
                <p className="text-xs text-gray-500">
                  {selectedChild.stats.unreadMessages} yeni
                </p>
                {selectedChild.stats.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {selectedChild.stats.unreadMessages}
                  </span>
                )}
              </CardContent>
            </Card>
          </Link>

          <Link href="/children">
            <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="font-medium text-sm">Çocuklar</p>
                <p className="text-xs text-gray-500">{children.length} çocuk</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/expenses">
            <Card className="hover:shadow-md cursor-pointer">
              <CardContent className="p-4 text-center">
                <PieChart className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="font-medium text-sm">Harcamalar</p>
                <p className="text-xs text-gray-500">
                  ₺{selectedChild.stats.monthlyExpenses}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/development">
            <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="font-medium text-sm">Gelişim</p>
                <p className="text-xs text-gray-500">Takip et</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Yaklaşan Etkinlikler</CardTitle>
                <Link href="/calendar">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Etkinlik
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.date} - {event.time}
                        </p>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="secondary">{event.responsible}</Badge>
                  </div>
                ))}
              </div>
              <Link href="/calendar">
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  Tüm Etkinlikleri Gör
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Son Mesajlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      message.unread
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50"
                    }`}
                    onClick={() => handleMarkMessageAsRead(message.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm flex items-center">
                        {message.from}
                        {message.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                        )}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{message.message}</p>
                  </div>
                ))}
              </div>
              <Link href="/messages">
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  Tüm Mesajları Gör
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Aylık Harcama Özeti</CardTitle>
              <CardDescription>Ocak 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Toplam Harcama</span>
                  <span className="font-bold text-lg">
                    ₺{monthlyExpenses.total}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span>Sizin Payınız</span>
                  <span className="font-bold text-lg text-indigo-600">
                    ₺{monthlyExpenses.yourShare}
                  </span>
                </div>
                <div className="space-y-3">
                  {monthlyExpenses.categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 ${category.color} rounded`}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {category.name}
                        </span>
                      </div>
                      <span className="font-medium">₺{category.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/expenses">
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  Detaylı Görünüm
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Günlük Öneriler</CardTitle>
              <CardDescription>Bu hafta için</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Okul toplantısı öncesi çocuğunuzun son karne notlarını
                      gözden geçirin
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-sm text-green-800">
                      Bu ay aktivite bütçeniz planladığınızdan %15 daha az
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-start space-x-2">
                    <Calendar className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Gelecek hafta 2 etkinlik çakışması var, planlamayı gözden
                      geçirin
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
