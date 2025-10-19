"use client";

import { useEffect, useState } from "react";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/composable/services/menuServices";
import {
  ImagePlus,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { useNotification } from "@/components/useNotification";

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    category: "",
  });
    const { showNotification, NotificationComponent } = useNotification();
  const [isEditing, setIsEditing] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const data = await getMenuItems();
      setMenu(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token") || "";
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    images.forEach((img) => formData.append("images", img));

    try {
      if (isEditing) {
        await updateMenuItem(form.id, formData, token);
        showNotification("Cập nhật món thành công!");
      } else {
        await createMenuItem(formData, token);
        showNotification("Thêm món thành công!");
      }
      resetForm();
      fetchMenu();
    } catch (err) {
      showNotification("Lỗi khi lưu món!", "error");
    }
  };

  const handleEdit = (item: any) => {
    setForm({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category || "",
    });
    setImages([]);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa món này không?")) return;
    const token = localStorage.getItem("token") || "";
    try {
      await deleteMenuItem(id, token);
      fetchMenu();
      showNotification("Đã xóa món!");
    } catch {
      showNotification("Lỗi khi xóa món!", "error");
    }
  };

  const resetForm = () => {
    setForm({ id: "", name: "", price: "", category: "" });
    setImages([]);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
        <NotificationComponent></NotificationComponent>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-600">Quản lý thực đơn</h1>
        <button
          onClick={fetchMenu}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all"
        >
          <RefreshCw size={18} /> Làm mới
        </button>
      </div>

      {/* Form thêm / sửa món */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Tên món"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Giá"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded p-2"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border rounded p-2"
          >
            <option value="">Chọn loại món</option>
            <option value="Đồ uống">Đồ uống</option>
            <option value="Món ăn">Món ăn</option>
            <option value="Tráng miệng">Tráng miệng</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer text-amber-600 hover:underline">
            <ImagePlus size={18} />
            <span>Chọn ảnh</span>
            <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
          </label>
        </div>

        {images.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {images.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-20 h-20 rounded-lg object-cover border"
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-amber-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-amber-600 transition"
          >
            {isEditing ? (
              <>
                <Save size={18} /> Lưu thay đổi
              </>
            ) : (
              <>
                <Plus size={18} /> Thêm món
              </>
            )}
          </button>
          {isEditing && (
            <button
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-400 transition"
            >
              <X size={18} /> Hủy
            </button>
          )}
        </div>
      </div>

      {/* Danh sách món */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-3 border hover:shadow-lg transition-all"
            >
              <div className="flex gap-2 overflow-x-auto">
                {item.images?.map((url: string, i: number) => (
                  <img
                    key={i}
                    src={url}
                    alt="menu"
                    className="w-20 h-20 rounded-lg object-cover border"
                  />
                ))}
              </div>
              <h3 className="font-semibold text-gray-800 mt-2">{item.name}</h3>
              <p className="text-amber-600 font-bold">
                {item.price.toLocaleString()}₫
              </p>
              <p className="text-sm text-gray-500">{item.category}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  <Pencil size={16} /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  <Trash2 size={16} /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
