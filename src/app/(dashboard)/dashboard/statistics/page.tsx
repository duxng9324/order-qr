"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/composable/services/orderServices";
import { RefreshCw, FileDown } from "lucide-react";
import { useNotification } from "@/components/useNotification";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function StatisticsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification, NotificationComponent } = useNotification();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const data = await getOrders(token);
      setOrders(data);
    } catch {
      showNotification("Lỗi khi tải danh sách đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🧮 Tính tổng tiền mỗi đơn
  const calculateTotal = (order: any) => {
    if (!order.items || order.items.length === 0) return 0;
    return order.items.reduce((sum: number, item: any) => {
      const price = item.menuItem?.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);
  };

  // 🧾 Xuất Excel
  const exportToExcel = () => {
    if (orders.length === 0) {
      showNotification("Không có dữ liệu để xuất", "error");
      return;
    }

    const formattedData = orders.map((order: any, index: number) => {
      const itemList = order.items
        ?.map(
          (item: any) =>
            `${item.menuItem?.name || "Tên món"} (x${item.quantity})${
              item.note ? ` - ${item.note}` : ""
            }`
        )
        .join("; ");

      return {
        STT: index + 1,
        Bàn: order.table?.name || "Không rõ",
        Trạng_thái: order.status,
        Ghi_chú: order.note || "",
        Ngày_tạo: new Date(order.createdAt).toLocaleString("vi-VN"),
        Danh_sách_món: itemList,
        Tổng_tiền: calculateTotal(order),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thống kê đơn hàng");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `orders-statistics-${new Date().toISOString().split("T")[0]}.xlsx`);
    showNotification("Đã xuất file Excel thành công!", "success");
  };

  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case "PENDING":
        return <span className={`${base} bg-yellow-100 text-yellow-700`}>Đang chờ</span>;
      case "COOKING":
        return <span className={`${base} bg-blue-100 text-blue-700`}>Đang làm</span>;
      case "DONE":
        return <span className={`${base} bg-green-100 text-green-700`}>Hoàn tất</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}>Không rõ</span>;
    }
  };

  return (
    <div className="p-8">
      <NotificationComponent />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-600">📊 Thống kê đơn hàng</h1>
        <div className="flex gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
          >
            <RefreshCw size={18} />
            Làm mới
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            <FileDown size={18} />
            Xuất Excel
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400">Không có đơn hàng nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 border-b">#</th>
                <th className="px-4 py-3 border-b">Bàn</th>
                <th className="px-4 py-3 border-b">Trạng thái</th>
                <th className="px-4 py-3 border-b">Món đã gọi</th>
                <th className="px-4 py-3 border-b">Ghi chú</th>
                <th className="px-4 py-3 border-b">Ngày tạo</th>
                <th className="px-4 py-3 border-b text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const total = calculateTotal(order);
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-all border-b last:border-0"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold">
                      {order.table?.name || "Không rõ bàn"}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3">
                      {order.items && order.items.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {order.items.map((item: any) => (
                            <li key={item.id}>
                              <span className="font-medium text-gray-800">
                                {item.menuItem?.name || "Tên món"}
                              </span>{" "}
                              x{item.quantity}
                              {item.note && (
                                <span className="text-gray-500"> — {item.note}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">Không có món</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.note || "—"}</td>
                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-600">
                      {total.toLocaleString("vi-VN")} ₫
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
