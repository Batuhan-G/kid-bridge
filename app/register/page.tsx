import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Users } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
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
          <CardTitle>Hesap Oluşturun</CardTitle>
          <CardDescription>Çocuklarınız için daha iyi bir gelecek inşa etmeye başlayın</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad</Label>
              <Input id="firstName" placeholder="Adınız" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad</Label>
              <Input id="lastName" placeholder="Soyadınız" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" placeholder="ornek@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rolünüz</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Rolünüzü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Ebeveyn</SelectItem>
                <SelectItem value="viewer">İzleyici (Büyükbaba/anne, Yeni Eş)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm">
              <Link href="/terms" className="text-indigo-600 hover:underline">
                Kullanım Şartları
              </Link>{" "}
              ve{" "}
              <Link href="/privacy" className="text-indigo-600 hover:underline">
                Gizlilik Politikası
              </Link>
              {"'nı kabul ediyorum"}
            </Label>
          </div>
          <Link href="/dashboard">
            <Button className="w-full">Hesap Oluştur</Button>
          </Link>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Zaten hesabınız var mı?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline">
                Giriş Yapın
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
