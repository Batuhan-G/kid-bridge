"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Calendar, MessageCircle, Users, PieChart, TrendingUp, Menu, Home, Bell, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MobileNavProps } from './mobile-nav.types'

const MobileNav = ({ children, selectedChild, onChildChange, totalStats }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // usePathname import'unu ekle
  // import { usePathname } from "next/navigation"

  const handleNavClick = () => {
    setIsOpen(false)
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      badge: null,
    },
    {
      name: "Takvim",
      href: "/calendar",
      icon: Calendar,
      badge: totalStats?.events || 0,
    },
    {
      name: "Mesajlar",
      href: "/messages",
      icon: MessageCircle,
      badge: totalStats?.messages || 0,
    },
    {
      name: "Çocuklar",
      href: "/children",
      icon: Users,
      badge: children.length,
    },
    {
      name: "Harcamalar",
      href: "/expenses",
      icon: PieChart,
      badge: null,
    },
    {
      name: "Gelişim Takibi",
      href: "/development",
      icon: TrendingUp,
      badge: null,
    },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden relative">
          <Menu className="w-5 h-5" />
          {(totalStats?.messages || 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {totalStats?.messages}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 z-[100]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-white text-lg">OrtakEv</SheetTitle>
                  <SheetDescription className="text-indigo-100">Aile Yönetim Platformu</SheetDescription>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Child Selector */}
          <div className="p-4 border-b bg-gray-50">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Aktif Çocuk</p>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-indigo-600 text-white">{selectedChild?.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{selectedChild?.name}</p>
                  <p className="text-sm text-gray-600">{selectedChild?.age} yaşında</p>
                </div>
              </div>

              {/* Quick Child Switch */}
              <div className="flex space-x-2 mt-3">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => {
                      onChildChange(child)
                      setIsOpen(false)
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedChild?.id === child.id
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                        : "bg-white border hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">
                      {child.avatar}
                    </div>
                    <span>{child.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.name} href={item.href} onClick={handleNavClick}>
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.badge !== null && item.badge > 0 && (
                        <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Bell className="w-4 h-4 mr-3" />
                Bildirimler
                {(totalStats?.messages || 0) > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {totalStats?.messages}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Settings className="w-4 h-4 mr-3" />
                Ayarlar
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700" size="sm">
                <LogOut className="w-4 h-4 mr-3" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNav }
