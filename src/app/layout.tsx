import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import { OrderProvider } from "../context/OrderContext";
import Header from "@/components/Header";
import Link from "next/link";

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
        <OrderProvider>
          <CartProvider>
            <Header />

            <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 pt-20">
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
                  <h3 className="text-white font-semibold mb-2">
                    Về chúng tôi
                  </h3>
                  <p>
                    QR Food giúp nhà hàng và khách hàng kết nối dễ dàng thông
                    qua mã QR hiện đại.
                  </p>
                </div>
              </div>
              <div className="text-center py-3 border-t border-gray-700 text-gray-400">
                © {new Date().getFullYear()} QR Food. All rights reserved.
              </div>
            </footer>
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
