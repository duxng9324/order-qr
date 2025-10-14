"use client";
import { useEffect, useState } from "react";

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
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        🍔 Our Menu
      </h1>


      {/* Hiển thị khi menu trống */}
      {menu.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          🍽️ Không có món nào trong menu
        </p>
      )}
    </div>
  );
}
