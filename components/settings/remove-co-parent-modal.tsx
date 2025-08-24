"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { UserMinus, Loader2, X, AlertTriangle } from "lucide-react"

interface RemoveCoParentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  coParentEmail: string
  connectionId: string
}

export function RemoveCoParentModal({ 
  open, 
  onOpenChange, 
  onSuccess, 
  coParentEmail,
  connectionId
}: RemoveCoParentModalProps) {
  const [emailConfirmation, setEmailConfirmation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (emailConfirmation.trim().toLowerCase() !== coParentEmail.toLowerCase()) {
      toast({
        title: "Hata",
        description: "Email adresi eşleşmiyor. Lütfen doğru email adresini girin.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const result = await api.removeConnection(connectionId)
      
      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Co-parent bağlantısı kaldırıldı",
        })
        setEmailConfirmation("")
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      console.error('Remove co-parent error:', error)
      toast({
        title: "Hata",
        description: "Co-parent kaldırılırken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setEmailConfirmation("")
      onOpenChange(false)
    }
  }

  const isEmailMatch = emailConfirmation.trim().toLowerCase() === coParentEmail.toLowerCase()

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
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Co-Parent Kaldır</span>
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
                <p className="text-sm text-red-700">
                  <strong>{coParentEmail}</strong> ile co-parent bağlantınızı kaldırmak üzeresiniz.
                </p>
                <p className="text-sm text-red-700 mt-2">
                  Bu işlem sonrası:
                </p>
                <ul className="text-sm text-red-700 mt-1 ml-4 list-disc">
                  <li>Ortak çocuk verilerine erişim kesilecek</li>
                  <li>Mesajlaşma geçmişi korunacak</li>
                  <li>Karşı tarafa bildirim gönderilecek</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailConfirmation">
                Email Doğrulaması
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                Devam etmek için <strong>{coParentEmail}</strong> adresini aşağıya yazın:
              </p>
              <Input
                id="emailConfirmation"
                type="email"
                placeholder={coParentEmail}
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
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Kaldırılıyor...
                  </>
                ) : (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Co-Parent Kaldır
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}