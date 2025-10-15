"use client";
import { useCart } from "@/components/CartContext";
import MenuCard from "@/components/MenuCard";
import { useNotification } from "@/components/useNotification";
import { getListMenu } from "@/composable/services/menuServices";
import { getTableById } from "@/composable/services/tableServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [table, setTable] = useState<any>();
  const param = useParams<any>();
  const { addToCart } = useCart();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    const fetchMenu = async () => {
      const menu = await getListMenu();
      setMenu(menu);
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchTable = async (tableId: string) => {
      if (!tableId) return;
      const tableData = await getTableById(tableId);
      setTable(tableData);
      localStorage.setItem("tableId", tableData?.id);
    };

    fetchTable(param.id);
  }, [param.id]);

  const handleAddToCart = (item: any) => {
    try {
      addToCart(item);
      showNotification(`${item.name} đã được thêm vào giỏ hàng!`, "success");
    } catch (err) {
      showNotification(`Lỗi: Không thể thêm ${item.name} vào giỏ!`, "error");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <NotificationComponent></NotificationComponent>

      {table?.name ? (
        <>
          <h2 className="text-amber-600 text-3xl font-semibold">
            {table?.name?.toUpperCase()}
          </h2>
        </>
      ) : (
        <>
          <h2 className="text-amber-900 text-3xl font-semibold mb-3">
            Vui lòng quét qr trên bàn để order
          </h2>
        </>
      )}

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        🍔 Our Menu
      </h1>
      {/* Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menu &&
          menu.map((menuItem) => (
            <MenuCard
              key={menuItem.id}
              id={menuItem.id}
              name={menuItem.name}
              price={menuItem.price}
              images={menuItem.images}
              onAddToCart={() => handleAddToCart(menuItem)}
            />
          ))}
      </div>

      {/* Hiển thị khi menu trống */}
      {menu.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          🍽️ Không có món nào trong menu
        </p>
      )}
    </div>
  );
}
