import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageCircle, Calendar, PieChart, Shield, Users, Brain } from "lucide-react"
import { Footer } from "@/components/footer/footer"
import Link from "next/link"

export default function HelpPage() {
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
          Yardım Merkezi
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          KidBridge kullanımı hakkında merak ettiğiniz her şey burada. 
          Hızlı başlangıç yapın veya detaylı rehberleri inceleyin.
        </p>
      </section>

      {/* Quick Start Guide */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Hızlı Başlangıç</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>1. Hesap Oluşturun</CardTitle>
              <CardDescription>Ücretsiz hesabınızı oluşturun ve çocuğunuzun profilini ekleyin</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <MessageCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>2. Diğer Ebeveynle Bağlanın</CardTitle>
              <CardDescription>Çocuğunuzun diğer ebeveynini davet edin ve güvenli iletişim kurun</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>3. Takvimi Kullanmaya Başlayın</CardTitle>
              <CardDescription>Ortak takvimde etkinlikleri planlamaya başlayın</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Feature Guides */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Özellik Rehberleri</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Calendar className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle>Ortak Takvim Kullanımı</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Etkinlik ekleme ve düzenleme</li>
                <li>• Tekrarlayan etkinlikler oluşturma</li>
                <li>• Hatırlatıcı ayarlama</li>
                <li>• Çakışan randevuları çözme</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageCircle className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle>Güvenli Mesajlaşma</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• AI destekli iletişim önerileri</li>
                <li>• Çatışma önleme teknikleri</li>
                <li>• Önemli mesajları kaydetme</li>
                <li>• Bildirim ayarlarını yönetme</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <PieChart className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle>Harcama Takibi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Gider ekleme ve kategorilendirme</li>
                <li>• Makbuz fotoğrafı yükleme</li>
                <li>• Aylık raporları görüntüleme</li>
                <li>• Adil paylaşım hesaplama</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle>Gizlilik ve Güvenlik</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Çocuk verilerinin korunması</li>
                <li>• İki faktörlü doğrulama</li>
                <li>• Veri şifreleme sistemi</li>
                <li>• KVKK uyumluluğu</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Sık Sorulan Sorular</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>KidBridge ücretsiz mi?</AccordionTrigger>
              <AccordionContent>
                KidBridge temel özellikleri ücretsizdir. Premium planımızda gelişmiş AI özellikleri, 
                sınırsız dosya depolama ve öncelikli destek bulunmaktadır.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Verilerim güvende mi?</AccordionTrigger>
              <AccordionContent>
                Verilerinizi mümkün olan en yüksek güvenlik standartlarında korumaya odaklanıyoruz. 
                Platform geliştirme aşamasında SSL şifreleme ve KVKK uyumluluğu implementasyonu 
                planlanmıştır. Verilerinizi asla üçüncü taraflarla paylaşmayız.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Diğer ebeveyn nasıl davet edilir?</AccordionTrigger>
              <AccordionContent>
                Çocuk profili oluşturduktan sonra, 'Ebeveyn Davet Et' butonuna tıklayarak 
                diğer ebeveynin email adresini girebilirsiniz. Davet linki email ile gönderilecektir.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Mobil uygulama var mı?</AccordionTrigger>
              <AccordionContent>
                Şu anda web uygulaması olarak hizmet veriyoruz ancak mobil tarayıcınızdan 
                sorunsuz kullanabilirsiniz. Mobil uygulama geliştirmesi planlarımız arasındadır.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>AI önerileri nasıl çalışır?</AccordionTrigger>
              <AccordionContent>
                AI sistemimiz, mesajlaşma geçmişinizi analiz ederek çatışmaları önleyecek 
                ve yapıcı iletişimi destekleyecek öneriler sunar. Kişisel verileriniz 
                sadece size özel öneriler için kullanılır.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Hesabımı nasıl silebilirim?</AccordionTrigger>
              <AccordionContent>
                Hesap silme işlemi için ayarlar sayfasından 'Hesabı Sil' seçeneğini 
                kullanabilirsiniz. Bu işlem kalıcıdır ve tüm verileriniz silinir.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Hala yardıma mı ihtiyacınız var?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Aradığınız cevabı bulamadınız mı? Destek ekibimiz size yardımcı olmaktan mutluluk duyar.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Bizimle İletişime Geçin
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}