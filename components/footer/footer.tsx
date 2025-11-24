import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="flex self-start items-center space-x-2 mb-4">
              <Link href="/">
                <div className="flex items-center justify-center cursor-pointer">
                  <img
                    src="/kid-bridge-logo1.png"
                    alt="KidBridge Logo"
                    className="w-12 h-12"
                  />
                </div>
              </Link>
              <span className="text-xl font-bold">KidBridge</span>
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
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 KidBridge — Tüm Hakları Saklıdır</p>
        </div>
      </div>
    </footer>
  )
}