import { CartProvider } from "@/components/CartContext";
import "./globals.css";
import Link from "next/link";
import { ShoppingCartButton } from "@/components/ShopingCartButton";

export const metadata = {
  title: "QR Food - Order by QR Code",
  description: "Hệ thống đặt món ăn thông minh qua mã QR.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-theme="cupcake">
      <body className="bg-gray-50 text-gray-800 flex flex-col min-h-screen relative">
        <CartProvider>
          {/* Header */}
          <header className="bg-orange-500 text-white shadow-md fixed w-full z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold tracking-wide">
                QR<span className="text-yellow-300">Food</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex gap-6 text-sm font-medium">
                <Link href="/" className="hover:text-yellow-300 transition">
                  Trang chủ
                </Link>
                <Link href="/menu" className="hover:text-yellow-300 transition">
                  Thực đơn
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-yellow-300 transition"
                >
                  Liên hệ
                </Link>
                <Link
                  href="/login"
                  className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
                >
                  Đăng nhập
                </Link>
              </nav>

              {/* Client-side cart button */}
              <ShoppingCartButton />
            </div>
          </header>

          <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
            <div className="h-[29]"></div>
            {children}
          </main>

          <footer className="bg-gray-900 text-gray-300 text-sm mt-10">
            <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Liên hệ</h3>
                <p>Email: ongdungdz@gmail.com</p>
                <p>Hotline: 0343389956</p>
                <p>Địa chỉ: 123 Đường Ẩm Thực, Hà Nội</p>
              </div>
              <div className="text-right md:text-left">
                <h3 className="text-white font-semibold mb-2">Về chúng tôi</h3>
                <p>
                  QR Food giúp nhà hàng và khách hàng kết nối dễ dàng thông qua
                  mã QR hiện đại.
                </p>
              </div>
            </div>
            <div className="text-center py-3 border-t border-gray-700 text-gray-400">
              © {new Date().getFullYear()} QR Food. All rights reserved.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
