import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">OrtakEv</span>
          </div>
          <CardTitle>Hesabınıza Giriş Yapın</CardTitle>
          <CardDescription>Çocuklarınızla ilgili tüm bilgilere erişim sağlayın</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" placeholder="ornek@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" type="password" />
          </div>
          <div className="flex items-center justify-between">
            <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
              Şifremi Unuttum
            </Link>
          </div>
          <Link href="/dashboard">
            <Button className="w-full">Giriş Yap</Button>
          </Link>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Hesabınız yok mu?{" "}
              <Link href="/register" className="text-indigo-600 hover:underline">
                Kayıt Olun
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
