"use client";

import { getMenuItemById } from "@/composable/services/menuServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/components/useNotification";

export default function MenuItemContent() {
  const [menuItem, setMenuItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const param = useParams<{ menuItemId: string }>();
  const { addToCart } = useCart();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    const fetchMenuItem = async (id: string) => {
      try {
        const menuItemData = await getMenuItemById(id);
        setMenuItem(menuItemData);
        setSelectedImage(menuItemData?.images?.[0] || null);
      } catch (err) {
        console.error("Lỗi tải món ăn:", err);
      }
    };

    if (param.menuItemId) fetchMenuItem(param.menuItemId);
  }, [param.menuItemId]);

  const handleAddToCart = () => {
    if (!menuItem) return;
    addToCart({
      ...menuItem,
      quantity,
      note,
    });
    showNotification(`${menuItem.name} đã được thêm vào giỏ hàng!`, "success");
  };

  if (!menuItem)
    return (
      <div className="text-center py-10 text-gray-500">
        Đang tải thông tin món ăn...
      </div>
    );

  return (
    <div className="relative max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-lg mt-0 sm:mt-8">
      <NotificationComponent />

      {/* Layout responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Ảnh sản phẩm */}
        <div>
          <div className="relative w-full h-[280px] sm:h-[400px] rounded-2xl overflow-hidden shadow-md">
            <Image
              src={selectedImage || "/placeholder.jpg"}
              alt={menuItem.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Hình nhỏ (thumbnail) */}
          {menuItem.images?.length > 1 && (
            <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2">
              {menuItem.images.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden cursor-pointer border-2 flex-shrink-0 ${
                    img === selectedImage
                      ? "border-amber-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`image-${idx}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
              {menuItem.name}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              {menuItem.description}
            </p>

            <p className="text-2xl font-bold text-amber-600 mb-6">
              {menuItem.price?.toLocaleString()}₫
            </p>

            <textarea
              placeholder="Ghi chú cho món (ví dụ: ít đá, ít đường...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4 text-sm sm:text-base"
              rows={3}
            />
          </div>

          {/* Điều chỉnh số lượng + thêm giỏ */}
          <div className="hidden md:flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 font-semibold transition"
            >
              🛒 Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>

      {/* --- Nút cố định ở dưới cho mobile --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-amber-500 text-white px-4 py-3 rounded-xl hover:bg-amber-600 font-semibold transition w-[50%] text-sm"
        >
          🛒 Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
