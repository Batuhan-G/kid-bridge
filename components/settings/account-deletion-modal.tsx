"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { Trash2, Loader2, X, AlertTriangle, Skull } from "lucide-react"

interface AccountDeletionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountDeletionModal({ open, onOpenChange }: AccountDeletionModalProps) {
  const [emailConfirmation, setEmailConfirmation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.email) {
      toast({
        title: "Hata",
        description: "Kullanıcı bilgisi bulunamadı",
        variant: "destructive",
      })
      return
    }

    if (emailConfirmation.trim().toLowerCase() !== user.email.toLowerCase()) {
      toast({
        title: "Hata",
        description: "Email adresi eşleşmiyor. Lütfen doğru email adresini girin.",
        variant: "destructive",
      })
      return
    }

    setShowFinalConfirmation(true)
  }

  const handleFinalConfirmation = async () => {
    setIsLoading(true)
    
    try {
      const result = await api.deleteAccount(emailConfirmation)
      
      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Hesap Silindi",
          description: "Hesabınız başarıyla silindi. Co-parent bildirimler gönderildi.",
        })
        
        // Kullanıcıyı çıkış yaptır
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      }
    } catch (error) {
      console.error('Account deletion error:', error)
      toast({
        title: "Hata",
        description: "Hesap silinirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setEmailConfirmation("")
      setShowFinalConfirmation(false)
      onOpenChange(false)
    }
  }

  const handleBack = () => {
    setShowFinalConfirmation(false)
  }

  const isEmailMatch = emailConfirmation.trim().toLowerCase() === user?.email?.toLowerCase()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {!showFinalConfirmation ? (
            // İlk aşama: Email doğrulaması
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold flex items-center space-x-2 text-red-600">
                    <Trash2 className="w-5 h-5" />
                    <span>Hesabı Sil</span>
                  </h2>
                  <p className="text-sm text-gray-600">Bu işlem geri alınamaz.</p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Warning */}
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800 mb-1">Dikkat!</h3>
                    <p className="text-sm text-red-700 mb-2">
                      Hesabınızı silmek üzeresiniz. Bu işlem sonrası:
                    </p>
                    <ul className="text-sm text-red-700 ml-4 list-disc space-y-1">
                      <li>Tüm kişisel verileriniz silinecek</li>
                      <li>Çocuk bilgileri ve gelişim kayıtları silinecek</li>
                      <li>Co-parent bağlantıları otomatik sonlandırılacak</li>
                      <li>Mesaj geçmişi silinecek</li>
                      <li>Bu işlem <strong>geri alınamaz</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailConfirmation">
                    Email Doğrulaması
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Devam etmek için <strong>{user?.email}</strong> adresini aşağıya yazın:
                  </p>
                  <Input
                    id="emailConfirmation"
                    type="email"
                    placeholder={user?.email}
                    value={emailConfirmation}
                    onChange={(e) => setEmailConfirmation(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    variant="destructive"
                    disabled={isLoading || !isEmailMatch}
                    className="mb-2 sm:mb-0"
                  >
                    Devam Et
                  </Button>
                </div>
              </form>
            </>
          ) : (
            // İkinci aşama: Final onay
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold flex items-center space-x-2 text-red-600">
                    <Skull className="w-5 h-5" />
                    <span>Son Uyarı</span>
                  </h2>
                  <p className="text-sm text-gray-600">Bu gerçekten son şansınız.</p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Final Warning */}
              <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
                <div className="text-center">
                  <Skull className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="font-bold text-red-900 mb-2">
                    HESABINIZ SİLİNECEK!
                  </h3>
                  <p className="text-sm text-red-800 font-medium">
                    Bu işlem <strong>GERİ ALINAMAZ</strong>.
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    Emin misiniz? Tüm verileriniz kaybolacak.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="mb-2 sm:mb-0"
                >
                  Geri Dön
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="mb-2 sm:mb-0"
                >
                  İptal
                </Button>
                <Button 
                  onClick={handleFinalConfirmation} 
                  variant="destructive"
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Siliniyor...
                    </>
                  ) : (
                    <>
                      <Skull className="w-4 h-4 mr-2" />
                      EVE T, HESABı SİL
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}