"use client";

import { ShoppingCart, Plus, Minus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { createOrder } from "@/composable/services/orderServices";
import { useNotification } from "@/components/useNotification";
import { useOrderContext } from "@/context/OrderContext";

interface OrderData {
  tableId: string;
  userId?: string;
  note?: string;
  items: {
    menuId: string;
    quantity: number;
    note?: string;
  }[];
}

export function ShoppingCartButton() {
  const [open, setOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, updateNote } = useCart();
  const { showNotification, NotificationComponent } = useNotification();
  const { addOrderId } = useOrderContext();
  const router = useRouter();
  const [tableId, setTableId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTableId(localStorage.getItem("tableId"));
    }
  }, []);

  const totalPrice = cart.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    try {
      const tableId = `${localStorage.getItem("tableId")}`;
      const orderData: OrderData = {
        tableId,
        note: "Gọi từ giỏ hàng",
        items: cart.map((item: any) => ({
          menuId: item.id,
          quantity: item.quantity,
          note: item.note || "",
        })),
      };

      const res = await createOrder(orderData);

      addOrderId(res.id);

      showNotification("Đặt món thành công!");

      router.push("/order");
      setOpen(false);
    } catch (error) {
      showNotification("Đặt món không thành công!", "error");
      setOpen(false);
    }
  };

  return (
    <>
      {/* Nút giỏ hàng */}
      <NotificationComponent></NotificationComponent>
      <button
        onClick={() => setOpen(true)}
        className="relative bg-yellow-400 text-gray-800 p-2 rounded-full shadow-md hover:bg-yellow-300 transition"
        title="Giỏ hàng"
      >
        <ShoppingCart className="w-5 h-5" />
        {cart.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {cart.length}
          </span>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "translate-x-full"} w-full sm:w-96`}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="font-semibold text-lg">Giỏ hàng</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Nội dung giỏ hàng */}
        <div className="p-4 overflow-y-auto h-[calc(100%-160px)]">
          {cart.length === 0 ? (
            <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item: any) => (
                <li key={item.id} className="flex flex-col gap-2 border-b pb-2">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#FF6900]">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.price.toLocaleString()}₫ / 1 cái
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-red-500 border px-2 py-1 rounded hover:bg-gray-200"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-gray-500 px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-red-500 border px-2 py-1 rounded hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Ghi chú */}
                  <textarea
                    value={item.note || ""}
                    onChange={(e) => updateNote(item.id, e.target.value)}
                    placeholder="Thêm ghi chú..."
                    className="w-full border rounded px-2 py-1 text-sm text-gray-500"
                  />

                  {/* Tổng tiền từng món */}
                  <p className="text-red-500 text-right font-semibold">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center ">
          <p className="font-semibold text-red-500">
            Tổng cộng: {totalPrice.toLocaleString()}₫
          </p>
          <button
            disabled={!tableId || cart.length === 0}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition"
            onClick={handleOrder}
          >
            Đặt Món
          </button>
        </div>
      </div>

      {/* Overlay cho mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
        ></div>
      )}
    </>
  );
}
