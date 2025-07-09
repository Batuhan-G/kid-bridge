"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  PieChart,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Car,
  GraduationCap,
  Heart,
  Home,
  Gamepad2,
  Trash2,
  Filter,
  ArrowLeft,
  Calendar,
} from "lucide-react"
import { ChildSelector } from "@/components/child-selector"
import { Sidebar } from "@/components/sidebar"
import { SidebarTrigger } from "@/components/sidebar-trigger"
import Link from "next/link"

interface Expense {
  id: number
  title: string
  amount: number
  category: string
  date: string
  child: string
  responsible: string
  description?: string
}

export default function ExpensesPage() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentUser] = useState("Anne") // Simulated current user

  const children = [
    { id: 1, name: "Elif", age: 8, avatar: "E", school: "Atatürk İlkokulu" },
    { id: 2, name: "Can", age: 12, avatar: "C", school: "Gazi Ortaokulu" },
    { id: 3, name: "Zeynep", age: 6, avatar: "Z", school: "Anaokulu" },
  ]

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      title: "Okul Kırtasiyesi",
      amount: 150,
      category: "eğitim",
      date: "2024-01-15",
      child: "Elif",
      responsible: "Anne",
      description: "Defter, kalem ve diğer okul malzemeleri",
    },
    {
      id: 2,
      title: "Doktor Muayenesi",
      amount: 300,
      category: "sağlık",
      date: "2024-01-18",
      child: "Elif",
      responsible: "Baba",
      description: "Rutin kontrol muayenesi",
    },
    {
      id: 3,
      title: "Oyuncak",
      amount: 75,
      category: "eğlence",
      date: "2024-01-20",
      child: "Elif",
      responsible: "Anne",
      description: "Lego seti",
    },
    {
      id: 4,
      title: "Kıyafet",
      amount: 200,
      category: "giyim",
      date: "2024-01-22",
      child: "Elif",
      responsible: "Baba",
      description: "Kış kıyafetleri",
    },
  ])

  const expenseCategories = [
    { id: "eğitim", name: "Eğitim", icon: GraduationCap, color: "bg-blue-500" },
    { id: "sağlık", name: "Sağlık", icon: Heart, color: "bg-red-500" },
    { id: "giyim", name: "Giyim", icon: ShoppingCart, color: "bg-green-500" },
    { id: "ulaşım", name: "Ulaşım", icon: Car, color: "bg-yellow-500" },
    { id: "barınma", name: "Barınma", icon: Home, color: "bg-purple-500" },
    { id: "eğlence", name: "Eğlence", icon: Gamepad2, color: "bg-pink-500" },
  ]

  const totalStats = {
    events: children.reduce((sum) => sum + 2, 0),
    messages: children.reduce((sum) => sum + 1, 0),
    expenses: children.reduce((sum) => sum + 800, 0),
  }

  const handleAddExpense = async (formData: FormData) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newExpense: Expense = {
      id: expenses.length + 1,
      title: formData.get("title") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      date: formData.get("date") as string,
      child: formData.get("child") as string,
      responsible: currentUser,
      description: formData.get("description") as string,
    }

    setExpenses([...expenses, newExpense])
    setIsAddExpenseOpen(false)
    setIsSubmitting(false)
    setSuccessMessage("Harcama başarıyla eklendi!")

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteExpense = (expenseId: number) => {
    const expense = expenses.find((e) => e.id === expenseId)

    // Only allow deletion if current user is responsible for the expense
    if (expense && expense.responsible === currentUser) {
      setExpenses(expenses.filter((e) => e.id !== expenseId))
    }
  }

  const canDeleteExpense = (expense: Expense) => {
    return expense.responsible === currentUser
  }

  const filteredExpenses = selectedChild ? expenses.filter((expense) => expense.child === selectedChild.name) : expenses

  const calculateStats = (expenseList: Expense[]) => {
    const total = expenseList.reduce((sum, expense) => sum + expense.amount, 0)
    const thisMonth = expenseList
      .filter((expense) => new Date(expense.date).getMonth() === new Date().getMonth())
      .reduce((sum, expense) => sum + expense.amount, 0)

    const lastMonth = expenseList
      .filter((expense) => {
        const expenseDate = new Date(expense.date)
        const lastMonthDate = new Date()
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
        return expenseDate.getMonth() === lastMonthDate.getMonth()
      })
      .reduce((sum, expense) => sum + expense.amount, 0)

    const change = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0

    return { total, thisMonth, change }
  }

  const stats = calculateStats(filteredExpenses)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        children={children}
        selectedChild={selectedChild || children[0]}
        onChildChange={setSelectedChild}
        totalStats={totalStats}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Sidebar Trigger */}
              <SidebarTrigger onToggle={() => setIsSidebarOpen(!isSidebarOpen)} totalStats={totalStats} />

              <div className="flex items-center space-x-2">
                <PieChart className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Harcama Takibi</h1>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <ChildSelector
                children={children}
                selectedChild={selectedChild || children[0]}
                onChildChange={setSelectedChild}
              />

              <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Harcama
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      handleAddExpense(formData)
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Yeni Harcama Ekle</DialogTitle>
                      <DialogDescription>Çocuğunuz için yeni bir harcama kaydı oluşturun</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Başlık
                        </Label>
                        <Input id="title" name="title" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Tutar (₺)
                        </Label>
                        <Input id="amount" name="amount" type="number" step="0.01" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="child" className="text-right">
                          Çocuk
                        </Label>
                        <Select name="child" required>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Çocuk seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {children.map((child) => (
                              <SelectItem key={child.id} value={child.name}>
                                {child.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Kategori
                        </Label>
                        <Select name="category" required>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center space-x-2">
                                  <category.icon className="w-4 h-4" />
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Tarih
                        </Label>
                        <Input id="date" name="date" type="date" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Açıklama
                        </Label>
                        <Textarea id="description" name="description" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Ekleniyor..." : "Harcama Ekle"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile Add Button */}
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="lg:hidden">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Breadcrumb */}
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Ortak Takvim</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Mobile Child Selector */}
        <div className="lg:hidden mb-4">
          <ChildSelector
            children={children}
            selectedChild={selectedChild || children[0]}
            onChildChange={setSelectedChild}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Harcama</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{stats.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{stats.thisMonth.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.change > 0 ? "+" : ""}
                {stats.change.toFixed(1)}% geçen aya göre
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ortalama</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₺{filteredExpenses.length > 0 ? (stats.total / filteredExpenses.length).toFixed(0) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Harcama başına</p>
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>
                Harcama Listesi
                {selectedChild && (
                  <span className="text-sm font-normal text-gray-600 ml-2">- {selectedChild.name}</span>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrele
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tümü</TabsTrigger>
                <TabsTrigger value="eğitim">Eğitim</TabsTrigger>
                <TabsTrigger value="sağlık">Sağlık</TabsTrigger>
                <TabsTrigger value="diğer">Diğer</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {filteredExpenses.map((expense) => {
                  const category = expenseCategories.find((cat) => cat.id === expense.category)
                  const IconComponent = category?.icon || ShoppingCart

                  return (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${category?.color || "bg-gray-500"} bg-opacity-10`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{expense.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{new Date(expense.date).toLocaleDateString("tr-TR")}</span>
                            <span>•</span>
                            <span>{expense.child}</span>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              {expense.responsible}
                            </Badge>
                          </div>
                          {expense.description && <p className="text-sm text-gray-500 mt-1">{expense.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-bold text-lg">₺{expense.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{category?.name}</div>
                        </div>
                        {canDeleteExpense(expense) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </TabsContent>

              {expenseCategories.slice(0, 3).map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
                  {filteredExpenses
                    .filter((expense) => expense.category === category.id)
                    .map((expense) => {
                      const IconComponent = category.icon

                      return (
                        <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${category.color} bg-opacity-10`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{expense.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{new Date(expense.date).toLocaleDateString("tr-TR")}</span>
                                <span>•</span>
                                <span>{expense.child}</span>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">
                                  {expense.responsible}
                                </Badge>
                              </div>
                              {expense.description && (
                                <p className="text-sm text-gray-500 mt-1">{expense.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="font-bold text-lg">₺{expense.amount.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">{category.name}</div>
                            </div>
                            {canDeleteExpense(expense) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </TabsContent>
              ))}

              <TabsContent value="diğer" className="space-y-4 mt-4">
                {filteredExpenses
                  .filter((expense) => !["eğitim", "sağlık"].includes(expense.category))
                  .map((expense) => {
                    const category = expenseCategories.find((cat) => cat.id === expense.category)
                    const IconComponent = category?.icon || ShoppingCart

                    return (
                      <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${category?.color || "bg-gray-500"} bg-opacity-10`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{expense.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{new Date(expense.date).toLocaleDateString("tr-TR")}</span>
                              <span>•</span>
                              <span>{expense.child}</span>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                {expense.responsible}
                              </Badge>
                            </div>
                            {expense.description && <p className="text-sm text-gray-500 mt-1">{expense.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-bold text-lg">₺{expense.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{category?.name}</div>
                          </div>
                          {canDeleteExpense(expense) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
