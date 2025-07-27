import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import {
  Calendar,
  MessageCircle,
  Users,
  PieChart,
  Brain,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">OrtakEv</span>
          </div>
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
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Çocuklarınız İçin{" "}
          <span className="text-indigo-600">Ortak Gelecek</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Boşanmış ebeveynler için geliştirilmiş platform ile çocuklarınızla
          ilgili sorumlulukları, etkinlikleri ve iletişimi sağlıklı bir şekilde
          yönetin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="px-8 py-3">
              Ücretsiz Başlayın
            </Button>
          </Link>
          <Link href="/demo">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 bg-transparent"
            >
              Demo İzle
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Neden OrtakEv?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Ortak Takvim</CardTitle>
              <CardDescription>
                Çocuğunuzun okul, sağlık ve sosyal etkinliklerini tek yerden
                planlayın
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Güvenli Mesajlaşma</CardTitle>
              <CardDescription>
                AI destekli iletişim önerileri ile sağlıklı diyalog kurun
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <PieChart className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Harcama Takibi</CardTitle>
              <CardDescription>
                Çocuğunuzla ilgili giderleri şeffaf bir şekilde paylaşın
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Çocuk Profili</CardTitle>
              <CardDescription>
                Gelişim notları, fotoğraflar ve önemli belgeleri saklayın
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>AI Destekli</CardTitle>
              <CardDescription>
                Yapay zeka ile çatışmaları azaltın ve planlamayı kolaylaştırın
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Güvenli & Yasal</CardTitle>
              <CardDescription>
                KVKK ve GDPR uyumlu, şifreli veri koruması
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Çocuklarınız İçin Daha İyi Bir Gelecek Başlıyor
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Binlerce aile OrtakEv ile daha sağlıklı iletişim kuruyor. Siz de bu
            değişimin parçası olun.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Hemen Başlayın - Ücretsiz
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">OrtakEv</span>
              </div>
              <p className="text-gray-400">
                Çocuklar için daha iyi bir gelecek inşa ediyoruz.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ürün</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features">Özellikler</Link>
                </li>
                <li>
                  <Link href="/pricing">Fiyatlandırma</Link>
                </li>
                <li>
                  <Link href="/demo">Demo</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Yardım Merkezi</Link>
                </li>
                <li>
                  <Link href="/contact">İletişim</Link>
                </li>
                <li>
                  <Link href="/privacy">Gizlilik</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Şirket</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about">Hakkımızda</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/careers">Kariyer</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OrtakEv. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
