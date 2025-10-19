"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useNotification } from "@/components/useNotification";
import {
  getUsers,
  updateUserRole,
  removeUser,
} from "@/composable/services/userServices";

export default function UserDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const { showNotification, NotificationComponent } = useNotification();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const data = await getUsers(token);
      setUsers(data);
    } catch (error: any) {
      showNotification(error.message || "Không thể tải danh sách người dùng", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditRole = (userId: string, currentRole: string) => {
    setEditingUserId(userId);
    setNewRole(currentRole);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewRole("");
  };

  const handleSaveRole = async (userId: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      await updateUserRole(userId, {role: newRole}, token);
      showNotification("Cập nhật vai trò thành công!");
      await fetchUsers();
      handleCancelEdit();
    } catch (error: any) {
      showNotification(error.message || "Không thể cập nhật vai trò", "error");
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      await removeUser(userId, token);
      showNotification("Đã xoá người dùng!");
      await fetchUsers();
    } catch (error: any) {
      showNotification(error.message || "Không thể xoá người dùng", "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <NotificationComponent />

      <h1 className="text-2xl font-semibold text-gray-800">
        Quản lý người dùng 👥
      </h1>
      <p className="text-gray-500 text-sm">
        Xem, chỉnh sửa quyền và xoá người dùng trong hệ thống.
      </p>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-center">ID</th>
              <th className="p-3 text-center">Tên</th>
              <th className="p-3 text-center">Email</th>
              <th className="p-3 text-center">Vai trò</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-amber-50 transition-colors duration-200"
              >
                <td className="text-center text-sm">{user.id}</td>
                <td className="text-center font-medium">{user.name}</td>
                <td className="text-center">{user.email}</td>

                <td className="text-center">
                  {editingUserId === user.id ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="select select-bordered select-sm w-32"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="STAFF">STAFF</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-600"
                          : user.role === "STAFF"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </td>

                <td className="text-center">
                  {editingUserId === user.id ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleSaveRole(user.id)}
                        className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditRole(user.id, user.role)}
                        className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          Không có người dùng nào.
        </p>
      )}
    </div>
  );
}
