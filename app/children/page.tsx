"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/lib/auth-guard"
import { api, type Child, type Milestone, type Document } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Users, Plus, Upload, FileText, Calendar, Heart, Home, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { SidebarTrigger } from "@/components/sidebar-trigger/sidebar-trigger"
import { Sidebar } from "@/components/sidebar/sidebar"

function ChildrenPageContent() {
  const { toast } = useToast()
  const [isAddChildOpen, setIsAddChildOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false)
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [isEditMilestoneOpen, setIsEditMilestoneOpen] = useState(false)
  const [currentChildId, setCurrentChildId] = useState<string>("")
  const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({})
  const [documents, setDocuments] = useState<Record<string, Document[]>>({})
  const [loadingMilestones, setLoadingMilestones] = useState<Record<string, boolean>>({})
  const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})
  
  // Milestone form state
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    description: "",
    category: "",
    achievedAt: "",
    notes: ""
  })
  
  // Document form state
  const [documentForm, setDocumentForm] = useState({
    title: "",
    description: "",
    file: null as File | null
  })

  // Child form state
  const [childForm, setChildForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    notes: "",
    profileImageUrl: ""
  })
  
  // Date picker state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Load children on mount
  useEffect(() => {
    loadChildren()
  }, [])

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

  // Calculate stats for sidebar from actual children data
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

  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  
  // Select first child when children are loaded
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0])
    }
  }, [children, selectedChild])
  
  const totalStats = {
    events: 0, // Will be implemented with calendar feature
    messages: 0, // Will be implemented with messaging feature  
    expenses: 0, // Will be calculated from actual expenses
  }

  // Validate form function
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!childForm.firstName.trim()) {
      errors.firstName = "Ad zorunludur"
    }
    
    if (!childForm.lastName.trim()) {
      errors.lastName = "Soyad zorunludur"
    }
    
    if (!childForm.dateOfBirth) {
      errors.dateOfBirth = "Doğum tarihi zorunludur"
    }
    
    if (!childForm.gender) {
      errors.gender = "Cinsiyet seçimi zorunludur"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Add child function
  const handleAddChild = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const response = await api.createChild({
        firstName: childForm.firstName,
        lastName: childForm.lastName,
        dateOfBirth: childForm.dateOfBirth,
        gender: childForm.gender,
        notes: childForm.notes,
        profileImageUrl: childForm.profileImageUrl
      })

      if (response.data) {
        toast({
          title: "Başarılı",
          description: "Çocuk başarıyla eklendi",
        })
        // Reset form
        setChildForm({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "",
          notes: "",
          profileImageUrl: ""
        })
        setSelectedDate(undefined)
        setValidationErrors({})
        setIsAddChildOpen(false)
        // Reload children
        loadChildren()
      } else {
        toast({
          title: "Hata",
          description: response.error || "Çocuk eklenemedi",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çocuk eklenemedi",
        variant: "destructive"
      })
    }
  }

  // Milestone categories
  const milestoneCategories = [
    "Fiziksel",
    "Zihinsel", 
    "Sosyal",
    "Duygusal",
    "Akademik",
    "Sağlık"
  ]

  // Load milestones for a child
  const loadMilestones = async (childId: string) => {
    setLoadingMilestones(prev => ({ ...prev, [childId]: true }))
    try {
      const response = await api.getMilestones(childId)
      if (response.data) {
        setMilestones(prev => ({ ...prev, [childId]: response.data! }))
      } else {
        toast({
          title: "Hata",
          description: response.error || "Kilometre taşları yüklenemedi",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Hata", 
        description: "Kilometre taşları yüklenemedi",
        variant: "destructive"
      })
    } finally {
      setLoadingMilestones(prev => ({ ...prev, [childId]: false }))
    }
  }

  // Load documents for a child
  const loadDocuments = async (childId: string) => {
    setLoadingDocuments(prev => ({ ...prev, [childId]: true }))
    try {
      const response = await api.getDocuments(childId)
      if (response.data) {
        setDocuments(prev => ({ ...prev, [childId]: response.data! }))
      } else {
        toast({
          title: "Hata",
          description: response.error || "Belgeler yüklenemedi", 
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Belgeler yüklenemedi",
        variant: "destructive"
      })
    } finally {
      setLoadingDocuments(prev => ({ ...prev, [childId]: false }))
    }
  }

  // Add milestone
  const handleAddMilestone = async () => {
    if (!milestoneForm.title || !milestoneForm.category || !milestoneForm.achievedAt) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await api.createMilestone(currentChildId, milestoneForm)
      if (response.data) {
        toast({
          title: "Başarılı",
          description: "Kilometre taşı eklendi"
        })
        setIsAddMilestoneOpen(false)
        setMilestoneForm({ title: "", description: "", category: "", achievedAt: "", notes: "" })
        loadMilestones(currentChildId)
      } else {
        toast({
          title: "Hata",
          description: response.error || "Kilometre taşı eklenemedi",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kilometre taşı eklenemedi",
        variant: "destructive"
      })
    }
  }

  // Edit milestone
  const handleEditMilestone = async () => {
    if (!selectedMilestone) return

    try {
      const response = await api.updateMilestone(selectedMilestone.id, milestoneForm)
      if (response.data) {
        toast({
          title: "Başarılı",
          description: "Kilometre taşı güncellendi"
        })
        setIsEditMilestoneOpen(false)
        setSelectedMilestone(null)
        setMilestoneForm({ title: "", description: "", category: "", achievedAt: "", notes: "" })
        loadMilestones(currentChildId)
      } else {
        toast({
          title: "Hata",
          description: response.error || "Kilometre taşı güncellenemedi",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kilometre taşı güncellenemedi",
        variant: "destructive"
      })
    }
  }

  // Delete milestone
  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      const response = await api.deleteMilestone(milestoneId)
      if (response.error) {
        toast({
          title: "Hata",
          description: response.error,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Kilometre taşı silindi"
        })
        loadMilestones(currentChildId)
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kilometre taşı silinemedi",
        variant: "destructive"
      })
    }
  }

  // Upload document
  const handleUploadDocument = async () => {
    if (!documentForm.title || !documentForm.file) {
      toast({
        title: "Hata",
        description: "Lütfen başlık ve dosya seçin",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await api.uploadFile(currentChildId, documentForm.file, {
        title: documentForm.title,
        description: documentForm.description
      })
      if (response.data) {
        toast({
          title: "Başarılı",
          description: "Dosya yüklendi"
        })
        setIsAddDocumentOpen(false)
        setDocumentForm({ title: "", description: "", file: null })
        loadDocuments(currentChildId)
      } else {
        toast({
          title: "Hata",
          description: response.error || "Dosya yüklenemedi",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Dosya yüklenemedi",
        variant: "destructive"
      })
    }
  }

  // Delete document
  const handleDeleteDocument = async (documentId: string, childId: string) => {
    try {
      const response = await api.deleteDocument(documentId)
      if (response.error) {
        toast({
          title: "Hata",
          description: response.error,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Belge silindi"
        })
        loadDocuments(childId)
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Belge silinemedi",
        variant: "destructive"
      })
    }
  }


  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Akademik":
        return "bg-blue-100 text-blue-800"
      case "Sosyal":
        return "bg-green-100 text-green-800"
      case "Sağlık":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
                        <span>Çocuklar</span>
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
                  <Button variant="ghost" size="sm" className="rounded-none border-r bg-indigo-50 text-indigo-600">
                    <List className="w-4 h-4 mr-1" />
                    Liste
                  </Button>
                </Link>
                <Link href="/children/multi-view">
                  <Button variant="ghost" size="sm" className="rounded-none">
                    <LayoutGrid className="w-4 h-4 mr-1" />
                    Çoklu
                  </Button>
                </Link>
              </div>
              
              <Dialog open={isAddChildOpen} onOpenChange={setIsAddChildOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Çocuk Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Yeni Çocuk Ekle</DialogTitle>
                    <DialogDescription>Çocuğunuzun bilgilerini girin</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="firstName" className="text-right">
                        Ad *
                      </Label>
                      <div className="col-span-3">
                        <Input 
                          id="firstName" 
                          className={`w-full ${validationErrors.firstName ? 'border-red-500' : ''}`}
                          value={childForm.firstName}
                          onChange={(e) => {
                            setChildForm({...childForm, firstName: e.target.value})
                            if (validationErrors.firstName) {
                              setValidationErrors({...validationErrors, firstName: ""})
                            }
                          }}
                          placeholder="Çocuğun adı"
                        />
                        {validationErrors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="lastName" className="text-right">
                        Soyad *
                      </Label>
                      <div className="col-span-3">
                        <Input 
                          id="lastName" 
                          className={`w-full ${validationErrors.lastName ? 'border-red-500' : ''}`}
                          value={childForm.lastName}
                          onChange={(e) => {
                            setChildForm({...childForm, lastName: e.target.value})
                            if (validationErrors.lastName) {
                              setValidationErrors({...validationErrors, lastName: ""})
                            }
                          }}
                          placeholder="Çocuğun soyadı"
                        />
                        {validationErrors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dateOfBirth" className="text-right">
                        Doğum Tarihi *
                      </Label>
                      <div className="col-span-3">
                        <div className="flex gap-2">
                          <select 
                            className={`flex h-10 w-full rounded-md border ${validationErrors.dateOfBirth ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring`}
                            value={childForm.dateOfBirth.split('-')[2] || ""}
                            onChange={(e) => {
                              const day = e.target.value
                              const [year, month] = childForm.dateOfBirth.split('-')
                              if (year && month && day) {
                                const newDate = `${year}-${month}-${day.padStart(2, '0')}`
                                setChildForm({...childForm, dateOfBirth: newDate})
                                setSelectedDate(new Date(newDate))
                                if (validationErrors.dateOfBirth) {
                                  setValidationErrors({...validationErrors, dateOfBirth: ""})
                                }
                              }
                            }}
                          >
                            <option value="">Gün</option>
                            {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                          
                          <select 
                            className={`flex h-10 w-full rounded-md border ${validationErrors.dateOfBirth ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring`}
                            value={childForm.dateOfBirth.split('-')[1] || ""}
                            onChange={(e) => {
                              const month = e.target.value
                              const [year, , day] = childForm.dateOfBirth.split('-')
                              if (year && month) {
                                const newDate = `${year}-${month.padStart(2, '0')}-${(day || '01').padStart(2, '0')}`
                                setChildForm({...childForm, dateOfBirth: newDate})
                                setSelectedDate(new Date(newDate))
                                if (validationErrors.dateOfBirth) {
                                  setValidationErrors({...validationErrors, dateOfBirth: ""})
                                }
                              }
                            }}
                          >
                            <option value="">Ay</option>
                            <option value="1">Ocak</option>
                            <option value="2">Şubat</option>
                            <option value="3">Mart</option>
                            <option value="4">Nisan</option>
                            <option value="5">Mayıs</option>
                            <option value="6">Haziran</option>
                            <option value="7">Temmuz</option>
                            <option value="8">Ağustos</option>
                            <option value="9">Eylül</option>
                            <option value="10">Ekim</option>
                            <option value="11">Kasım</option>
                            <option value="12">Aralık</option>
                          </select>
                          
                          <select 
                            className={`flex h-10 w-full rounded-md border ${validationErrors.dateOfBirth ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring`}
                            value={childForm.dateOfBirth.split('-')[0] || ""}
                            onChange={(e) => {
                              const year = e.target.value
                              const [, month, day] = childForm.dateOfBirth.split('-')
                              if (year) {
                                const newDate = `${year}-${(month || '01').padStart(2, '0')}-${(day || '01').padStart(2, '0')}`
                                setChildForm({...childForm, dateOfBirth: newDate})
                                setSelectedDate(new Date(newDate))
                                if (validationErrors.dateOfBirth) {
                                  setValidationErrors({...validationErrors, dateOfBirth: ""})
                                }
                              }
                            }}
                          >
                            <option value="">Yıl</option>
                            {Array.from({length: 18}, (_, i) => new Date().getFullYear() - i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        {validationErrors.dateOfBirth && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.dateOfBirth}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gender" className="text-right">
                        Cinsiyet *
                      </Label>
                      <div className="col-span-3">
                        <select 
                          id="gender" 
                          className={`flex h-10 w-full rounded-md border ${validationErrors.gender ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
                          value={childForm.gender}
                          onChange={(e) => {
                            setChildForm({...childForm, gender: e.target.value})
                            if (validationErrors.gender) {
                              setValidationErrors({...validationErrors, gender: ""})
                            }
                          }}
                        >
                          <option value="">Seçiniz</option>
                          <option value="Kız">Kız</option>
                          <option value="Erkek">Erkek</option>
                        </select>
                        {validationErrors.gender && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notlar
                      </Label>
                      <Textarea 
                        id="notes" 
                        className="col-span-3"
                        value={childForm.notes}
                        onChange={(e) => setChildForm({...childForm, notes: e.target.value})}
                        placeholder="Çocukla ilgili özel notlar"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddChild}>
                      Çocuk Ekle
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
        {/* Children List */}
        <div className="grid gap-8">
          {children.map((child) => (
            <Card key={child.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-2xl bg-indigo-600 text-white">
                      {child.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{child.firstName} {child.lastName}</CardTitle>
                    <CardDescription className="text-lg">
                      {calculateChildAge(child.dateOfBirth)} yaşında
                      {child.gender && ` • ${child.gender}`}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Doğum Tarihi</p>
                    <p className="font-medium">{new Date(child.dateOfBirth).toLocaleDateString("tr-TR")}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="info">Bilgiler</TabsTrigger>
                    <TabsTrigger value="files">Dosyalar</TabsTrigger>
                    <TabsTrigger value="notes">Gelişim Notları</TabsTrigger>
                    <TabsTrigger value="health">Sağlık</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Genel Bilgiler</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Yaş:</span>
                            <span>{calculateChildAge(child.dateOfBirth)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cinsiyet:</span>
                            <span>{child.gender || 'Belirtilmemiş'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Oluşturulma:</span>
                            <span>{new Date(child.createdAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Notlar</h3>
                        <p className="text-gray-600">{child.notes || 'Henüz not eklenmemiş'}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Dosyalar ve Belgeler</h3>
                      <Button size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Dosya Yükle
                      </Button>
                    </div>
                    <div className="grid gap-3">
                      {(documents[child.id] || []).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4" />
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(doc.createdAt).toLocaleDateString('tr-TR')} • {doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            İndir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Gelişim Notları</h3>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Not Ekle
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {(milestones[child.id] || []).map((milestone) => (
                        <div key={milestone.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getCategoryColor(milestone.category)}>{milestone.category}</Badge>
                              <span className="text-sm text-gray-600">Gelişim</span>
                            </div>
                            <span className="text-sm text-gray-500">{new Date(milestone.achievedAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{milestone.title}</h4>
                          {milestone.description && <p className="text-gray-700 text-sm mb-2">{milestone.description}</p>}
                          {milestone.notes && <p className="text-gray-600 text-sm">{milestone.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="health" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-red-500" />
                          Sağlık Bilgileri
                        </h3>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-red-800">Sağlık bilgileri çok yakında eklenecek</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                          Yaklaşan Randevular
                        </h3>
                        <div className="space-y-2">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-medium">Diş Kontrolü</p>
                            <p className="text-sm text-blue-600">25 Ocak 2024 - 16:00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChildrenPage() {
  return (
    <AuthGuard>
      <ChildrenPageContent />
    </AuthGuard>
  )
}
