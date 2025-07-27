"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/sidebar-trigger/sidebar-trigger";
import { Sidebar } from "@/components/sidebar/sidebar";

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

export default function Dashboard() {
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    messages: children.reduce(
      (sum, child) => sum + child.stats.unreadMessages,
      0
    ),
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
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">OrtakEv</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
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
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {totalStats.messages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {totalStats.messages}
                    </span>
                  )}
                </Button>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
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

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Hoş geldiniz, Ayşe
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
