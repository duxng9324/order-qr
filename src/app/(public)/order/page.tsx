"use client";

import { getOrderById } from "@/composable/services/orderServices";
import { useOrderContext } from "@/context/OrderContext";
import { useEffect, useState } from "react";


export default function OrderPage() {
  const { orderIds, clearOrders } = useOrderContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async (orderIds: any) => {
      try {
        const orderList = [];

        for (const id of orderIds) {
          const order = await getOrderById(id);
          if (order) orderList.push(order);
        }

        setOrders(orderList);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(orderIds);
  }, [orderIds]);

  if (loading)
    return <div className="p-6 text-center text-gray-600">Đang tải đơn hàng...</div>;

  if (!orders || orders.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">
        Bạn chưa có đơn hàng nào gần đây.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-amber-600 text-center">
        Danh sách những món bạn đã đặt
      </h1>

      {orders.map((order) => {
        const total =
          order.items?.reduce(
            (sum: number, item: any) => sum + item.quantity * item.menuItem.price,
            0
          ) || 0;

        return (
          <div
            key={order.id}
            className="border border-amber-400 rounded-2xl shadow-sm p-4 bg-white hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">
                Mã đơn: {order.id.slice(-6).toUpperCase()}
              </h2>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "COOKING"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Time */}
            <p className="text-sm text-gray-500 mb-3">
              Ngày tạo: {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>

            {/* Items */}
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b pb-2 last:border-none"
                >
                  <img
                    src={item.menuItem?.images?.[0]}
                    alt={item.menuItem?.name}
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.menuItem?.name}</p>
                    <p className="text-sm text-gray-500">
                      SL: {item.quantity} ×{" "}
                      {item.menuItem?.price.toLocaleString()}đ
                    </p>
                    {item.note && (
                      <p className="text-xs text-gray-400 italic">
                        Ghi chú: {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <hr className="my-3" />
            <div className="flex justify-between items-center">
              <p className="font-semibold">
                Tổng tiền: {total.toLocaleString()}đ
              </p>
              <button
                className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                onClick={() => alert(`Thanh toán đơn ${order.id}`)}
              >
                Thanh toán
              </button>
            </div>

            {order.note && (
              <p className="text-sm text-gray-500 mt-2 italic">
                Ghi chú: {order.note}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
