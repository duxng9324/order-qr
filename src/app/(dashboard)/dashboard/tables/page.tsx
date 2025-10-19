"use client";

import { useNotification } from "@/components/useNotification";
import {
  creatTable,
  getTables,
  removeTable,
} from "@/composable/services/tableServices";
import { ArrowDownToLine, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function TableDashboard() {
  const [me, setMe] = useState<any>();
  const [tables, setTables] = useState<any[]>();
  const [newTableName, setNewTableName] = useState("");
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    const me = {
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
      Phone: localStorage.getItem("phone"),
    };
    setMe(me);
  }, []);

  const fetchTables = async () => {
    const tables = await getTables();
    setTables(tables);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleRemove = async (tableId: string | number) => {
    const token = localStorage.getItem("token") || undefined;
    try {
      await removeTable(tableId, token);
      await fetchTables();
      showNotification("Đã xoá bàn!");
    } catch (error: any) {
      showNotification(error.message || "Không thể xoá bàn này", "error");
    }
  };

  const handleCreate = async () => {
    if (!newTableName.trim()) {
      showNotification("Vui lòng nhập tên bàn", "error");
      return;
    }

    const token = localStorage.getItem("token") || undefined;
    try {
      await creatTable({ name: newTableName }, token);
      setNewTableName("");
      await fetchTables();
      showNotification("Đã tạo bàn mới!");
    } catch (error: any) {
      showNotification(error.message || "Không thể tạo bàn mới", "error");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <NotificationComponent />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">
          Chào buổi sáng, {me?.name} 👋
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Hôm nay là {new Date().toLocaleDateString("vi-VN")}
        </p>
      </div>

      {/* Form tạo bàn */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-md">
        <input
          type="text"
          placeholder="Nhập tên bàn..."
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          onClick={handleCreate}
          className="flex w-full items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-amber-600 transition-all duration-300 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tạo bàn
        </button>
      </div>

      {/* ✅ Bảng: chỉ hiện trên desktop */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm sm:text-base">
            <tr>
              <th className="p-3 text-center">ID</th>
              <th className="p-3 text-center">Tên bàn</th>
              <th className="p-3 text-center">QR CODE</th>
              <th className="p-3 text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {tables?.map((table) => (
              <tr
                key={table?.id}
                className="hover:bg-amber-50 transition-colors duration-200"
              >
                <td className="text-center font-medium">{table.id}</td>
                <td className="text-center">{table?.name}</td>

                <td className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={table?.qr?.url}
                      alt="QR code"
                      className="w-16 h-16 object-contain rounded-lg border"
                    />
                    <a
                      href={table?.qr?.url}
                      download={table.name}
                      className="text-amber-600 hover:text-amber-800 flex items-center gap-1 text-sm transition-colors"
                    >
                      <ArrowDownToLine className="w-4 h-4" /> Tải
                    </a>
                  </div>
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-error btn-sm sm:btn-md text-white flex items-center justify-center gap-1 hover:opacity-90 transition"
                    onClick={() => handleRemove(table.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Xóa</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Card: chỉ hiện trên mobile */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {tables?.map((table) => (
          <div
            key={table.id}
            className="p-4 bg-white rounded-xl shadow-md border border-gray-200 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">{table.name}</p>
              <p className="text-sm text-gray-500">ID: {table.id}</p>
            </div>
            <div className="flex gap-3">
              <a
                href={table?.qr?.url}
                download={table.name}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                <ArrowDownToLine className="w-5 h-5 text-gray-700" />
              </a>
              <button
                onClick={() => handleRemove(table.id)}
                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
