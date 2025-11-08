"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/lib/auth-guard"
import { api, Child } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { ChildSelector } from "@/components/child-selector/child-selector"
import { mapApiChildToSelector } from "@/components/child-selector/child-selector.types"
import type { Child as SelectorChild } from "@/components/child-selector/child-selector.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { MessageCircle, Send, Lightbulb, AlertTriangle, Check, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/sidebar-trigger/sidebar-trigger"
import { Sidebar } from "@/components/sidebar/sidebar"

interface Message {
  id: number
  sender: string
  content: string
  time: string
  isMe: boolean
}

interface Conversation {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: number
  child: string
  childId: string
}

function MessagesPageContent() {
  const { user, isLoading: authLoading } = useAuth()
  const [selectedChat, setSelectedChat] = useState("mehmet-elif")
  const [newMessage, setNewMessage] = useState("")
  const [showAISuggestion, setShowAISuggestion] = useState(false)
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [children, setChildren] = useState<Child[]>([])
  const [isLoadingChildren, setIsLoadingChildren] = useState(true)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)

  // Map API children to selector format
  const mappedChildren: SelectorChild[] = children.map(mapApiChildToSelector)
  const mappedSelectedChild: SelectorChild | null = selectedChild ? mapApiChildToSelector(selectedChild) : null

  // Handle child selector change
  const handleChildSelectorChange = (selectorChild: SelectorChild) => {
    if (selectorChild.id === "all") {
      setSelectedChild(children.length > 0 ? children[0] : null) // Default to first child for "all"
    } else {
      const apiChild = children.find(c => c.id === selectorChild.id)
      if (apiChild) {
        setSelectedChild(apiChild)
      }
    }
  }

  // Fetch children data - only when user is authenticated
  useEffect(() => {
    if (!user || authLoading) return
    
    const fetchChildren = async () => {
      try {
        setIsLoadingChildren(true)
        const result = await api.getChildren()
        if (!result.error && result.data) {
          setChildren(result.data)
          // Set first child as selected if none selected
          if (!selectedChild && result.data.length > 0) {
            setSelectedChild(result.data[0])
          }
        } else {
          console.error('Failed to fetch children:', result.error)
        }
      } catch (error) {
        console.error('Failed to fetch children:', error)
      } finally {
        setIsLoadingChildren(false)
      }
    }

    fetchChildren()
  }, [user, authLoading])
  
  const totalStats = {
    events: children.reduce((sum, child) => sum + (child._count?.activities || 0), 0),
    messages: children.reduce((sum, child) => sum + (child._count?.messages || 0), 0),
    expenses: children.reduce((sum, child) => sum + (child._count?.expenses || 0), 0),
  }

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "mehmet-elif",
      name: "Mehmet",
      lastMessage: "Elif'in doktor raporu eklendi",
      time: "5 saat önce",
      unread: 0,
      child: "Elif",
      childId: "1",
    },
    {
      id: "mehmet-can",
      name: "Mehmet",
      lastMessage: "Can'ın okul toplantısı yarın",
      time: "2 saat önce",
      unread: 2,
      child: "Can",
      childId: "2",
    },
    {
      id: "mehmet-zeynep",
      name: "Mehmet",
      lastMessage: "Zeynep'in anaokulu kayıtları",
      time: "1 gün önce",
      unread: 0,
      child: "Zeynep",
      childId: "3",
    },
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ayse",
      content: "Merhaba Mehmet, Elif'in okul toplantısı için hazırlık yapmamız gerekiyor.",
      time: "10:30",
      isMe: true,
    },
    {
      id: 2,
      sender: "mehmet",
      content: "Tabii, ne tür hazırlıklar yapmamız gerekiyor?",
      time: "10:45",
      isMe: false,
    },
    {
      id: 3,
      sender: "ayse",
      content: "Öğretmeni son karne notları hakkında konuşmak istiyor. Elif'in matematik notları biraz düşük.",
      time: "10:47",
      isMe: true,
    },
    {
      id: 4,
      sender: "mehmet",
      content: "Anladım. Evde matematik çalışması için bir program yapabiliriz. Sen ne düşünüyorsun?",
      time: "11:15",
      isMe: false,
    },
    {
      id: 5,
      sender: "ayse",
      content: "Bu konuda biraz endişeliyim açıkçası. Elif'e çok baskı yapmak istemiyorum ama...",
      time: "11:20",
      isMe: true,
    },
  ])

  const aiSuggestions = [
    "Çocuğunuzun akademik gelişimi için ortak bir plan önerisi: 'Elif'in matematik konusunda desteklenmesi için haftada 2 gün, her birimizin 1 gün olmak üzere çalışma programı oluşturabiliriz.'",
    "Daha yapıcı bir yaklaşım: 'Elif'in güçlü olduğu alanları da değerlendirerek, matematik konusunda motivasyonunu artıracak yöntemler bulabiliriz.'",
    "Çocuk odaklı çözüm önerisi: 'Önce Elif'in bu konudaki düşüncelerini de alalım, belki farklı bir öğrenme yöntemi daha etkili olabilir.'",
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "ayse",
        content: newMessage,
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      }
      setMessages([...messages, newMsg])

      // Update conversation last message
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedChat ? { ...conv, lastMessage: newMessage, time: "Şimdi" } : conv,
        ),
      )

      setNewMessage("")
      setShowAISuggestion(false)
    }
  }

  const handleMessageChange = (value: string) => {
    setNewMessage(value)
    // AI önerisi tetikleme koşulu
    if (
      value.toLowerCase().includes("endişe") ||
      value.toLowerCase().includes("problem") ||
      value.toLowerCase().includes("sorun")
    ) {
      setShowAISuggestion(true)
    } else {
      setShowAISuggestion(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion)
    setShowAISuggestion(false)
  }

  const handleConversationClick = (convId: string) => {
    setSelectedChat(convId)
    setIsMobileConversationOpen(true)
    // Mark as read
    setConversations(conversations.map((conv) => (conv.id === convId ? { ...conv, unread: 0 } : conv)))
  }

  const filteredConversations = selectedChild 
    ? conversations.filter((conv) => conv.childId === selectedChild.id)
    : conversations

  const currentConversation = conversations.find((conv) => conv.id === selectedChat)

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
                        <MessageCircle className="w-4 h-4" />
                        <span>Mesajlar</span>
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              
              {/* Mobile back button */}
              {isMobileConversationOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileConversationOpen(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Geri
                </Button>
              )}
            </div>
{!isLoadingChildren && mappedSelectedChild && mappedChildren.length > 0 && (
              <ChildSelector
                children={mappedChildren}
                selectedChild={mappedSelectedChild}
                onChildChange={handleChildSelectorChange}
                showAll={true}
              />
            )}
          </div>
        </div>
      </header>

      <Sidebar
        children={children}
        selectedChild={selectedChild || (children.length > 0 ? children[0] : null)}
        onChildChange={setSelectedChild}
        totalStats={totalStats}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List - Hidden on mobile when chat is open */}
          <div className={`lg:col-span-1 ${isMobileConversationOpen ? "hidden lg:block" : "block"}`}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Konuşmalar</CardTitle>
                <CardDescription>Çocuklarınızla ilgili mesajlar</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 max-h-[500px] overflow-y-auto">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleConversationClick(conv.id)}
                      className={`p-4 cursor-pointer transition-colors border-b hover:bg-gray-50 ${
                        selectedChat === conv.id ? "bg-indigo-50 border-indigo-200" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{conv.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{conv.name}</p>
                            <span className="text-xs text-gray-500">{conv.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className="text-xs">
                              {conv.child}
                            </Badge>
                            {conv.unread > 0 && <Badge className="bg-indigo-600 text-xs">{conv.unread}</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area - Full width on mobile when open */}
          <div className={`lg:col-span-3 ${!isMobileConversationOpen ? "hidden lg:block" : "block"}`}>
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{currentConversation?.name}</CardTitle>
                    <CardDescription>{currentConversation?.child} hakkında konuşuyor</CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg ${
                          message.isMe ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isMe ? "text-indigo-100" : "text-gray-500"}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* AI Suggestions */}
              {showAISuggestion && (
                <div className="border-t bg-blue-50 p-4">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-2">AI Mesaj Önerileri</h4>
                      <div className="space-y-2">
                        {aiSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left p-3 bg-white rounded border hover:bg-gray-50 text-sm transition-colors"
                          >
                            <div className="flex items-start space-x-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => handleMessageChange(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <p className="text-xs text-gray-600">
                    AI destekli iletişim önerileri aktif. Yapıcı diyalog için öneriler alabilirsiniz.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <AuthGuard>
      <MessagesPageContent />
    </AuthGuard>
  )
}
