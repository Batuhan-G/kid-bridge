"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Check, X, UserPlus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface PendingInvitation {
  id: string
  requesterEmail: string
  message?: string
  createdAt: string
  requester: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

interface PendingInvitationsProps {
  onCountUpdate?: (count: number) => void
}

export function PendingInvitations({ onCountUpdate }: PendingInvitationsProps) {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const fetchInvitations = async () => {
    try {
      const result = await api.getPendingConnections()
      if (result.error) {
        console.error('Failed to fetch invitations:', result.error)
      } else {
        setInvitations(result.data || [])
        onCountUpdate?.(result.data?.length || 0)
      }
    } catch (error) {
      console.error('Error fetching invitations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  const handleAccept = async (invitationId: string) => {
    setProcessingIds(prev => new Set(prev).add(invitationId))
    
    try {
      const result = await api.acceptConnection(invitationId)
      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Co-parent bağlantısı kabul edildi",
        })
        await fetchInvitations() // Refresh list
      }
    } catch (error) {
      toast({
        title: "Hata", 
        description: "İşlem sırasında bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(invitationId)
        return newSet
      })
    }
  }

  const handleReject = async (invitationId: string) => {
    setProcessingIds(prev => new Set(prev).add(invitationId))
    
    try {
      const result = await api.rejectConnection(invitationId)
      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Davet Reddedildi",
          description: "Co-parent daveti reddedildi",
        })
        await fetchInvitations() // Refresh list
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu", 
        variant: "destructive",
      })
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(invitationId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="ml-2">Davetler yükleniyor...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (invitations.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <UserPlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Bekleyen davet yok</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <Card key={invitation.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 mr-4">
                  <Avatar>
                    <AvatarFallback>
                      {invitation.requester.firstName[0]}{invitation.requester.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {invitation.requester.firstName} {invitation.requester.lastName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {invitation.requester.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(invitation.id)}
                    disabled={processingIds.has(invitation.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    {processingIds.has(invitation.id) ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAccept(invitation.id)}
                    disabled={processingIds.has(invitation.id)}
                  >
                    {processingIds.has(invitation.id) ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              {invitation.message && (
                <div className="w-full">
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    "{invitation.message}"
                  </p>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                {new Date(invitation.createdAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}