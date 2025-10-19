"use client";

import { useEffect, useState } from "react";
import { Eye, RefreshCw, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { getOrders, statusChange } from "@/composable/services/orderServices";
import { useNotification } from "@/components/useNotification";

export default function OrderDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification, NotificationComponent } = useNotification();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || ""; 
      const data = await getOrders(token);
      setOrders(data.filter((order: any) => order.status !== "DONE"));
    } catch {
      showNotification("Lỗi khi tải đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const handleStatusChange = async (id: string , newStatus: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const order = await statusChange(id, {status: newStatus}, token)
      if(order?.status === newStatus){
        showNotification("Đã cập nhật trạng thái!", "success");
      }
      else
        showNotification("Không thể cập nhật trạng thái!", "error");
      fetchOrders();
    } catch {
      showNotification("Không thể cập nhật trạng thái!", "error");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="text-yellow-500" />;
      case "COOKING":
        return <Clock className="text-blue-500" />;
      case "DONE":
        return <CheckCircle className="text-green-500" />;
      default:
        return <Clock className="text-gray-400" />;
    }
  };

  const statusOptions = [
    { value: "PENDING", label: "Đang chờ" },
    { value: "COOKING", label: "Đang làm" },
    { value: "DONE", label: "Hoàn tất" },
  ];

  return (
    <div className="p-6">
      <NotificationComponent></NotificationComponent>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-600">Quản lý đơn hàng</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all"
        >
          <RefreshCw size={18} />
          Làm mới
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400">Không có đơn hàng nào.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={"p-5 bg-white rounded-2xl shadow hover:shadow-lg transition-all border border-gray-100 "}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="font-semibold text-gray-800">
                    {order.table?.name || "Không rõ bàn"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>

              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Ghi chú:</span> {order.note || "Không có"}
              </p>

              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <p className="font-semibold text-sm text-gray-700 mb-1">Món đã gọi:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="flex justify-between">
                      <div>
                        -{" "}
                        <span className="font-medium text-gray-800">
                          {item.menuItem?.name || "Tên món"}
                        </span>
                        <span className="text-gray-500"> ({item.note})</span>
                      </div>
                      <span className="font-medium text-gray-700">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Thanh đổi trạng thái */}
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm text-gray-600 font-medium">Trạng thái:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
