import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageCircle } from "lucide-react"
import { Footer } from "@/components/footer/footer"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/kid-bridge-logo1.png"
              alt="KidBridge Logo"
              className="w-12 h-12"
            />
            <span className="text-2xl font-bold text-gray-900">KidBridge</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/register">
              <Button>Kayıt Ol</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          İletişim
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Size nasıl yardımcı olabiliriz? Herhangi bir sorunuz, öneriniz veya 
          geri bildiriminiz varsa bizimle iletişime geçmekten çekinmeyin.
        </p>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Mesaj Gönderin</CardTitle>
              <CardDescription>
                Formu doldurarak bize ulaşabilirsiniz. En kısa sürede size geri dönüş yapacağız.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad *</Label>
                <Input id="name" placeholder="Adınızı ve soyadınızı girin" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-posta *</Label>
                <Input id="email" type="email" placeholder="ornek@email.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Konu</Label>
                <Input id="subject" placeholder="Mesajınızın konusu" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mesaj *</Label>
                <Textarea 
                  id="message" 
                  placeholder="Lütfen mesajınızı buraya yazın..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button className="w-full">
                Mesaj Gönder
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="flex flex-col space-y-6 h-full">
            <Card className="flex-1">
              <CardHeader>
                <Mail className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle>E-posta Desteği</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  7/24 e-posta desteği için bizimle iletişime geçin.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Genellikle 24 saat içinde yanıtlıyoruz.
                </p>
                <p className="font-semibold text-indigo-600">
                  destek@kidbridge.com
                </p>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle>Canlı Destek</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Canlı destek özelliğimiz çok yakında hizmetinizde olacak.
                </p>
                <p className="text-sm text-gray-500 mb-10">
                  Şimdilik e-posta desteğimizi kullanabilirsiniz.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Çok Yakında
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Quick Access */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hızlı Çözüm Arıyorsanız
          </h2>
          <p className="text-gray-600 mb-6">
            Çoğu sorunun cevabını Yardım Merkezi'mizde bulabilirsiniz.
          </p>
          <Link href="/help">
            <Button variant="outline" size="lg">
              Yardım Merkezi'ni Ziyaret Edin
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}