"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Calendar, PieChart, MessageSquare, TrendingUp, Users, Settings, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  children: Array<{
    id: number
    name: string
    age: number
    avatar: string
    school?: string
  }>
  selectedChild: {
    id: number
    name: string
    age: number
    avatar: string
    school?: string
  }
  onChildChange: (child: any) => void
  totalStats: {
    events: number
    messages: number
    expenses: number
  }
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ children, selectedChild, onChildChange, totalStats, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const navigationItems = [
    {
      name: "Dashboard",
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
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">OrtakEv</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Selected Child */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-indigo-600 text-white text-lg">{selectedChild.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-900">{selectedChild.name}</h3>
                <p className="text-sm text-gray-600">{selectedChild.age} yaş</p>
                {selectedChild.school && <p className="text-xs text-gray-500">{selectedChild.school}</p>}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
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
                    <AvatarFallback className="bg-indigo-600 text-white text-sm">{child.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{child.name}</div>
                    <div className="text-xs text-gray-500">{child.age} yaş</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Ayarlar</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
