"use client"

import { AuthGuard } from "@/lib/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CoParentManagement } from "@/components/settings/co-parent-management"
import { AccountDeletionModal } from "@/components/settings/account-deletion-modal"
import { useState } from "react"

function SettingsPageContent() {
  const { user } = useAuth()
  const [isAccountDeletionModalOpen, setIsAccountDeletionModalOpen] = useState(false)

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
                  Ana Sayfa
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Ayarlar</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 max-w-4xl">
         
          {/* Kullanıcı Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Bilgileri</CardTitle>
              <CardDescription>
                Hesap bilgileriniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ad Soyad:</span>
                  <span>{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">E-posta:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kayıt Tarihi:</span>
                  <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR") : "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

           {/* Co-Parent Yönetimi */}
          <CoParentManagement />

            {/* Hesap Yönetimi */}
          <Card>
            <CardHeader>
                <CardTitle>Hesap Yönetimi</CardTitle>
              <CardDescription>
                Hesabınızı yönetin veya silin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-red-800">Tehlikeli Alan</h3>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinir ve bu işlem geri alınamaz.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIsAccountDeletionModalOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hesabı Sil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AccountDeletionModal
        open={isAccountDeletionModalOpen}
        onOpenChange={setIsAccountDeletionModalOpen}
      />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsPageContent />
    </AuthGuard>
  )
}