"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { UserPlus, UserMinus, Loader2, Users, X } from "lucide-react"
import { InviteCoParentModal } from "@/components/invite-co-parent-modal/invite-co-parent-modal"
import { RemoveCoParentModal } from "./remove-co-parent-modal"

interface CoParentConnection {
  id: string
  requesterEmail: string
  receiverEmail: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  message?: string
  createdAt: string
  coParentEmail?: string
  coParentInfo?: any
}

interface PendingSentInvitation {
  id: string
  requesterEmail: string
  receiverEmail: string
  status: 'PENDING'
  message?: string
  createdAt: string
}

export function CoParentManagement() {
  const [connection, setConnection] = useState<CoParentConnection | null>(null)
  const [sentInvitation, setSentInvitation] = useState<PendingSentInvitation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const { toast } = useToast()

  const fetchConnectionStatus = async () => {
    setIsLoading(true)
    try {
      // Check for accepted connections first
      const result = await api.getConnectionStatus()
      
      if (result.error) {
        console.error('Connection status fetch error:', result.error)
        setConnection(null)
      } else if (result.data?.hasConnection) {
        setConnection(result.data.connection)
        setSentInvitation(null)
        return
      }

      // If no accepted connection, check for sent pending invitations
      const sentResult = await api.getSentInvitations()
      if (!sentResult.error && sentResult.data && sentResult.data.length > 0) {
        // Show the first (most recent) sent invitation
        const sent = sentResult.data[0]
        setSentInvitation({
          id: sent.id,
          requesterEmail: sent.requesterEmail,
          receiverEmail: sent.receiverEmail,
          status: sent.status,
          message: sent.message,
          createdAt: sent.createdAt
        })
        setConnection(null)
      } else {
        setConnection(null)
        setSentInvitation(null)
      }
    } catch (error) {
      console.error('Connection status fetch error:', error)
      setConnection(null)
      setSentInvitation(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConnectionStatus()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge variant="default" className="bg-green-100 text-green-800">Bağlı</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Bekliyor</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Reddedildi</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const handleRemoveCoParent = () => {
    setIsRemoveModalOpen(true)
  }

  const handleInviteSuccess = () => {
    toast({
      title: "Başarılı",
      description: "Co-parent daveti gönderildi",
    })
    fetchConnectionStatus() // Durumu yenile
  }

  const handleCancelInvitation = async () => {
    if (!sentInvitation) return
    
    setIsCanceling(true)
    try {
      const result = await api.cancelInvitation(sentInvitation.id)
      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Davet başarıyla iptal edildi",
        })
        fetchConnectionStatus() // Durumu yenile
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Davet iptal edilirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsCanceling(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <CardTitle>Co-Parent Yönetimi</CardTitle>
          </div>
          <CardDescription>
            Diğer ebeveynle bağlantınızı yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Yükleniyor...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <CardTitle>Co-Parent Yönetimi</CardTitle>
          </div>
          <CardDescription>
            Diğer ebeveynle bağlantınızı yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connection ? (
            // Co-parent bağlantısı var
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {connection.coParentEmail || 
                         (connection.receiverEmail === connection.requesterEmail 
                          ? connection.receiverEmail 
                          : connection.requesterEmail)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Bağlantı tarihi: {new Date(connection.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(connection.status)}
                  {connection.status === 'ACCEPTED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveCoParent}
                      className="text-red-600 hover:text-red-700"
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Kaldır
                    </Button>
                  )}
                </div>
              </div>
              {connection.message && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Mesaj:</strong> {connection.message}
                  </p>
                </div>
              )}
            </div>
          ) : sentInvitation ? (
            // Gönderilmiş pending davet var
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">
                        {sentInvitation.receiverEmail}
                      </p>
                      <p className="text-sm text-blue-600">
                        Davet gönderildi: {new Date(sentInvitation.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Bekliyor
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelInvitation}
                    disabled={isCanceling}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {isCanceling ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    İptal Et
                  </Button>
                </div>
              </div>
              {sentInvitation.message && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Gönderilen Mesaj:</strong> {sentInvitation.message}
                  </p>
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Davetiniz {sentInvitation.receiverEmail} kullanıcısına gönderildi. Onaylanmasını bekliyorsunuz.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setIsInviteModalOpen(true)}
                  disabled
                  className="opacity-50 cursor-not-allowed"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Başka Davet Gönder
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Mevcut davet yanıtlanana kadar yeni davet gönderemezsiniz.
                </p>
              </div>
            </div>
          ) : (
            // Co-parent bağlantısı yok
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Co-Parent Bağlantısı Yok</h3>
              <p className="text-gray-600 mb-6">
                Çocuklarınızı birlikte yönetmek için diğer ebeveynle bağlantı kurun.
              </p>
              <Button onClick={() => setIsInviteModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Co-Parent Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <InviteCoParentModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onSuccess={handleInviteSuccess}
      />

      {connection && (
        <RemoveCoParentModal
          open={isRemoveModalOpen}
          onOpenChange={setIsRemoveModalOpen}
          coParentEmail={connection.coParentEmail || connection.requesterEmail || connection.receiverEmail}
          connectionId={connection.id}
          onSuccess={() => {
            toast({
              title: "Başarılı",
              description: "Co-parent bağlantısı kaldırıldı",
            })
            fetchConnectionStatus() // Durumu yenile
          }}
        />
      )}
    </>
  )
}