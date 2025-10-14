"use client";
import MenuCard from "@/components/MenuCard";
import { useEffect, useState } from "react";

export function handleAddToCart(id: string | number) {    
  console.log("Đã thêm món:", id);
}

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("API lỗi hoặc chưa chạy!");
        return res.json();
      })
      .then(setMenu)
      .catch((err) => {
        console.error("Lỗi fetch API:", err);
        alert("Không kết nối được tới API menu!");
      });
  }, []);



  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        🍔 Our Menu
      </h1>

      {/* Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menu &&
          menu.map((menuItem) => (
            <MenuCard
              key={menuItem.id}
              id={menuItem.id}
              name={menuItem.name}
              price={menuItem.price}
              images={menuItem.images}
              onAddToCart={(id) => handleAddToCart(id)}
            />
          ))}
      </div>

      {/* Hiển thị khi menu trống */}
      {menu.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          🍽️ Không có món nào trong menu
        </p>
      )}
    </div>
  );
}
