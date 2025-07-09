"use client"

import { useState } from "react"
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
import { Users, Plus, ArrowLeft, Upload, FileText, ImageIcon, Calendar, Heart } from "lucide-react"
import Link from "next/link"

export default function ChildrenPage() {
  const [isAddChildOpen, setIsAddChildOpen] = useState(false)

  const children = [
    {
      id: 1,
      name: "Elif",
      age: 8,
      birthDate: "2015-03-15",
      school: "Atatürk İlkokulu",
      grade: "3. Sınıf",
      avatar: "E",
      healthInfo: "Astım tedavisi görüyor",
      notes: "Matematik konusunda destek gerekiyor",
    },
    {
      id: 2,
      name: "Can",
      age: 12,
      birthDate: "2011-07-22",
      school: "Gazi Ortaokulu",
      grade: "7. Sınıf",
      avatar: "C",
      healthInfo: "Sağlıklı",
      notes: "Spor aktivitelerine çok ilgili",
    },
    {
      id: 3,
      name: "Zeynep",
      age: 6,
      birthDate: "2017-11-10",
      school: "Minik Adımlar Anaokulu",
      grade: "Büyük Grup",
      avatar: "Z",
      healthInfo: "Alerji testleri yapılacak",
      notes: "Sosyal gelişimi çok iyi",
    },
  ]

  const getChildFiles = (childId: number) => {
    const allFiles = {
      1: [
        { id: 1, name: "Karne - 1. Dönem", type: "document", date: "2024-01-10", size: "2.3 MB" },
        { id: 2, name: "Sağlık Raporu", type: "document", date: "2024-01-05", size: "1.8 MB" },
      ],
      2: [
        { id: 3, name: "Spor Kulübü Belgesi", type: "document", date: "2024-01-08", size: "1.2 MB" },
        { id: 4, name: "Okul Fotoğrafı", type: "image", date: "2023-12-20", size: "4.2 MB" },
      ],
      3: [
        { id: 5, name: "Anaokulu Raporu", type: "document", date: "2024-01-12", size: "1.5 MB" },
        { id: 6, name: "Oyun Etkinliği", type: "image", date: "2024-01-10", size: "3.8 MB" },
      ],
    }
    return allFiles[childId as keyof typeof allFiles] || []
  }

  const getChildNotes = (childId: number) => {
    const allNotes = {
      1: [
        {
          id: 1,
          date: "2024-01-10",
          author: "Anne",
          note: "Matematik konusunda ilerleme kaydediyor. Çarpım tablosunu öğrendi.",
          category: "Akademik",
        },
      ],
      2: [
        {
          id: 2,
          date: "2024-01-08",
          author: "Baba",
          note: "Basketbol takımına seçildi. Çok mutlu.",
          category: "Sosyal",
        },
      ],
      3: [
        {
          id: 3,
          date: "2024-01-12",
          author: "Anne",
          note: "Anaokulu öğretmeni sosyal gelişiminin çok iyi olduğunu söyledi.",
          category: "Sosyal",
        },
      ],
    }
    return allNotes[childId as keyof typeof allNotes] || []
  }

  const getFileIcon = (type: string) => {
    return type === "image" ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />
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
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Çocuklar</h1>
              </div>
            </div>
            <Dialog open={isAddChildOpen} onOpenChange={setIsAddChildOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Çocuk Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Yeni Çocuk Ekle</DialogTitle>
                  <DialogDescription>Çocuğunuzun bilgilerini girin</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Ad Soyad
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="birthdate" className="text-right">
                      Doğum Tarihi
                    </Label>
                    <Input id="birthdate" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="school" className="text-right">
                      Okul
                    </Label>
                    <Input id="school" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="grade" className="text-right">
                      Sınıf
                    </Label>
                    <Input id="grade" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="health" className="text-right">
                      Sağlık Bilgisi
                    </Label>
                    <Textarea id="health" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsAddChildOpen(false)}>
                    Çocuk Ekle
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Children List */}
        <div className="grid gap-8">
          {children.map((child) => (
            <Card key={child.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-2xl bg-indigo-600 text-white">{child.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{child.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {child.age} yaşında • {child.school} • {child.grade}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Doğum Tarihi</p>
                    <p className="font-medium">{new Date(child.birthDate).toLocaleDateString("tr-TR")}</p>
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
                            <span>{child.age}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Okul:</span>
                            <span>{child.school}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sınıf:</span>
                            <span>{child.grade}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Notlar</h3>
                        <p className="text-gray-600">{child.notes}</p>
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
                      {getChildFiles(child.id).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-gray-600">
                                {file.date} • {file.size}
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
                      {getChildNotes(child.id).map((note) => (
                        <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getCategoryColor(note.category)}>{note.category}</Badge>
                              <span className="text-sm text-gray-600">{note.author}</span>
                            </div>
                            <span className="text-sm text-gray-500">{note.date}</span>
                          </div>
                          <p className="text-gray-700">{note.note}</p>
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
                          <p className="text-red-800">{child.healthInfo}</p>
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
