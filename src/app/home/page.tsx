"use client";
import { useCart } from "@/components/CartContext";
import MenuCard from "@/components/MenuCard";
import { useNotification } from "@/components/useNotification";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [menu, setMenu] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then(setMenu)
      .catch(() => console.error("Không lấy được menu"));
  }, []);

  const handleAddToCart = (item: any) => {
    try {
      addToCart(item);
      showNotification(`${item.name} đã được thêm vào giỏ hàng!`, "success");
    } catch (err) {
      showNotification(`Lỗi: Không thể thêm ${item.name} vào giỏ!`, "error");
    }
  };

  return (
    <div className="bg-base-100">
      <NotificationComponent></NotificationComponent>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Trải nghiệm đặt món qua QR Code
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Quét mã tại bàn – chọn món – thưởng thức! Nhanh, tiện và hiện đại 🍽️
        </p>
        <Link href="/menu" className="btn btn-neutral text-white">
          Xem Menu
        </Link>
      </section>

      {/* About */}
      <section className="py-16 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-orange-500">Về Nhà Hàng</h2>
        <p className="text-gray-600 leading-relaxed">
          Chúng tôi mang đến trải nghiệm ẩm thực kết hợp công nghệ hiện đại.
          Hệ thống đặt món qua mã QR giúp khách hàng gọi món nhanh chóng, giảm
          thời gian chờ và nâng cao chất lượng phục vụ.
        </p>
      </section>

      {/* Featured Menu */}
      <section className="py-12 bg-orange-50">
        <h2 className="text-3xl font-bold text-center mb-10 text-orange-500">
          Món Ăn Nổi Bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {menu.slice(0, 6).map((item) => (
            <MenuCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              images={item.images}
              onAddToCart={() => handleAddToCart(item)}
            />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-orange-500">Cách Hoạt Động</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <span className="text-4xl mb-2 block">📱</span>
            <h3 className="font-semibold text-lg mb-2">1. Quét QR tại bàn</h3>
            <p className="text-gray-600">Khách hàng quét mã QR được đặt trên bàn ăn.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <span className="text-4xl mb-2 block">🍔</span>
            <h3 className="font-semibold text-lg mb-2">2. Chọn món yêu thích</h3>
            <p className="text-gray-600">Xem menu trực tiếp trên điện thoại và đặt món.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <span className="text-4xl mb-2 block">🥢</span>
            <h3 className="font-semibold text-lg mb-2">3. Thưởng thức</h3>
            <p className="text-gray-600">Nhân viên sẽ phục vụ món ăn của bạn nhanh chóng.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-orange-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Liên Hệ Với Chúng Tôi</h2>
        <p>Email: <span className="font-medium">support@qrfood.vn</span></p>
        <p>Hotline: <span className="font-medium">0123 456 789</span></p>
        <p>Địa chỉ: 123 Đường Ẩm Thực, TP.HCM</p>
      </section>
    </div>
  );
}
