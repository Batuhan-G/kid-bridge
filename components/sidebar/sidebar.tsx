"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Calendar, PieChart, MessageSquare, TrendingUp, Users, Settings, X, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { SidebarProps } from './sidebar.types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function Sidebar({ children, selectedChild, onChildChange, totalStats, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

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

  const navigationItems = [
    {
      name: "Ana Sayfa",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
    },
    {
      name: "Takvim",
      href: "/calendar",
      icon: Calendar,
      current: pathname === "/calendar",
      badge: totalStats.events,
    },
    {
      name: "Harcamalar",
      href: "/expenses",
      icon: PieChart,
      current: pathname === "/expenses",
      badge: totalStats.expenses,
    },
    {
      name: "Mesajlar",
      href: "/messages",
      icon: MessageSquare,
      current: pathname === "/messages",
      badge: totalStats.messages,
    },
    {
      name: "Gelişim",
      href: "/development",
      icon: TrendingUp,
      current: pathname === "/development",
    },
    {
      name: "Çocuklar",
      href: "/children",
      icon: Users,
      current: pathname === "/children",
    },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="/kid-bridge-logo1.png"
                  alt="KidBridge Logo"
                  className="w-8 h-8"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">KidBridge</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-indigo-600 text-white text-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onToggle}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
            </nav>

            {/* Quick Stats */}
            <div className="p-4 border-t">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{totalStats.events}</div>
                <div className="text-xs text-gray-600">Etkinlik</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{totalStats.messages}</div>
                <div className="text-xs text-gray-600">Mesaj</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">₺{totalStats.expenses}</div>
                <div className="text-xs text-gray-600">Harcama</div>
              </div>
            </div>
            </div>

            {/* Child Selector */}
            <div className="p-4 border-t">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Çocuklar</h4>
            <div className="space-y-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    onChildChange(child)
                    onToggle()
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedChild.id === child.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-indigo-600 text-white text-sm">
                      {child.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{child.firstName} {child.lastName}</div>
                    <div className="text-xs text-gray-500">{calculateChildAge(child.dateOfBirth)} yaş</div>
                  </div>
                </button>
              ))}
            </div>
            </div>
          </div>

          {/* Footer - Always visible */}
          <div className="flex-shrink-0 p-4 border-t space-y-2 bg-white">
            <Link
              href="/settings"
              onClick={onToggle}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/settings"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Ayarlar</span>
            </Link>
            
            {/* Logout button with confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-red-500 text-white hover:bg-red-600 hover:text-white border border-red-600 shadow-sm">
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Çıkış Yapmak İstiyor Musunuz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hesabınızdan çıkış yapacaksınız. Bu işlemi onaylıyor musunuz?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">İptal</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        logout()
                        onToggle()
                      }}
                    >
                      Çıkış Yap
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </>
  )
}
