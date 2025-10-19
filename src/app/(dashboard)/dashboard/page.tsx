"use client";

import { User } from "@prisma/client";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  // Dữ liệu giả — sau này bạn có thể lấy từ API thật
  const [stats, setStats] = useState([
    { title: "Tổng đơn hôm nay", value: 32, icon: "🧾" },
    { title: "Doanh thu", value: "5.200.000₫", icon: "💰" },
    { title: "Khách đang phục vụ", value: 8, icon: "🍽️" },
    { title: "Món bán chạy", value: "Trà đào cam sả", icon: "⭐" },
  ]);
  const [ me, setMe ] = useState<any>();

  const data = [
    { name: "T2", revenue: 4200000 },
    { name: "T3", revenue: 3800000 },
    { name: "T4", revenue: 5000000 },
    { name: "T5", revenue: 6200000 },
    { name: "T6", revenue: 4800000 },
    { name: "T7", revenue: 5400000 },
    { name: "CN", revenue: 6100000 },
  ];

  const recentOrders = [
    { id: "#A123", table: "Bàn 5", total: "120.000₫", status: "Hoàn tất" },
    { id: "#A124", table: "Bàn 2", total: "95.000₫", status: "Đang làm" },
    { id: "#A125", table: "Bàn 7", total: "150.000₫", status: "Chờ thanh toán" },
  ];

  useEffect(() => {
    const me = {
        name: localStorage.getItem("name"),
        email: localStorage.getItem("emai"),
        Phone: localStorage.getItem("phone")
    }
    setMe(me);
  }, [])

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Chào buổi sáng, {me?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Hôm nay là {new Date().toLocaleDateString("vi-VN")}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.title}
            className="p-4 bg-white rounded-xl shadow flex items-center gap-3 hover:shadow-md transition"
          >
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-gray-500 text-sm">{s.title}</p>
              <p className="font-semibold text-lg">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-3">Doanh thu tuần này</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}tr`} />
              <Tooltip
                formatter={(value: number) =>
                  `${value.toLocaleString("vi-VN")}₫`
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-3">Đơn hàng gần đây</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th>Mã đơn</th>
                <th>Bàn</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td>{order.id}</td>
                  <td>{order.table}</td>
                  <td>{order.total}</td>
                  <td>
                    <span
                      className={`${
                        order.status === "Hoàn tất"
                          ? "text-green-600"
                          : order.status === "Đang làm"
                          ? "text-yellow-500"
                          : "text-orange-500"
                      } font-medium`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
