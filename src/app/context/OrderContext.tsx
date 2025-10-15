"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface OrderContextType {
  orderIds: string[];
  addOrderId: (id: string) => void;
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderIds, setOrderIds] = useState<string[]>([]);

  // 🔹 Lấy dữ liệu từ localStorage khi load trang
  useEffect(() => {
    const stored = localStorage.getItem("orderIds");
    if (stored) setOrderIds(JSON.parse(stored));
  }, []);

  // 🔹 Mỗi khi orderIds thay đổi, lưu lại localStorage
  useEffect(() => {
    localStorage.setItem("orderIds", JSON.stringify(orderIds));
  }, [orderIds]);

  const addOrderId = (id: string) => {
    setOrderIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const clearOrders = () => setOrderIds([]);

  return (
    <OrderContext.Provider value={{ orderIds, addOrderId, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook tiện dùng ở các component khác
export const useOrderContext = () => {
    const ctx = useContext(OrderContext);
    if (!ctx) throw new Error("useOrderContext must be used inside <OrderProvider>");
    return ctx;
};
