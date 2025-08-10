"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { UserPlus, Loader2, X } from "lucide-react"

interface InviteCoParentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function InviteCoParentModal({ open, onOpenChange, onSuccess }: InviteCoParentModalProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast({
        title: "Hata",
        description: "Email adresi gereklidir",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const result = await api.inviteCoParent({
        receiverEmail: email.trim(),
        message: message.trim() || undefined,
      })

      if (result.error) {
        // Map common backend errors to Turkish
        let errorMessage = result.error
        
        if (result.error.includes("already connected") || result.error.includes("zaten eşleşmiş")) {
          errorMessage = "Bu kullanıcı ile zaten eşleşmiş durumdasınız"
        } else if (result.error.includes("bekleyen bir davet var") || result.error.includes("bekleyen") || result.error.includes("pending")) {
          errorMessage = "Bu kullanıcı ile zaten bekleyen bir davet var"
        } else if (result.error.includes("not found") || result.error.includes("User not found") || result.error.includes("bulunamadı") || result.error.includes("kayıtlı kullanıcı bulunamadı")) {
          errorMessage = "Bu email adresi ile kayıtlı kullanıcı bulunamadı. Lütfen email adresini kontrol edin."
        } else if (result.error.includes("cannot invite yourself") || result.error.includes("Kendinizi")) {
          errorMessage = "Kendinizi davet edemezsiniz"
        } else if (result.error.includes("Bad Request")) {
          errorMessage = "Geçersiz istek. Lütfen bilgileri kontrol edin"
        } else if (result.error.includes("Network Error") || result.error.includes("fetch")) {
          errorMessage = "Bağlantı hatası. İnternet bağlantınızı kontrol edin."
        }

        toast({
          title: "Hata",
          description: errorMessage,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Co-parent daveti gönderildi",
        })
        setEmail("")
        setMessage("")
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      console.error('Invitation error:', error)
      let errorMessage = "Davet gönderilirken bir hata oluştu"
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          errorMessage = "Bağlantı hatası. İnternet bağlantınızı kontrol edin ve tekrar deneyin."
        } else if (error.message.includes("timeout")) {
          errorMessage = "İşlem zaman aşımına uğradı. Lütfen tekrar deneyin."
        }
      }
      
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setEmail("")
      setMessage("")
      onOpenChange(false)
    }
  }

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
              <h2 className="text-lg font-semibold flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Co-Parent Ekle</span>
              </h2>
              <p className="text-sm text-gray-600">Çocuklarınızı ortak yönetmek için diğer ebeveynin email adresini girin.</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mesaj (Opsiyonel)</Label>
              <Textarea
                id="message"
                placeholder="Merhaba, çocuklarımızı birlikte takip etmek için davet gönderiyorum..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                rows={3}
                maxLength={250}
              />
              <p className="text-xs text-gray-500">
                {message.length}/250 karakter
              </p>
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
                disabled={isLoading}
                className="mb-2 sm:mb-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Davet Gönder
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