"use client";

import { ShoppingCart } from "lucide-react";

interface MenuCardProps {
  id: string | number;
  name: string;
  price: number;
  images?: string[];
  onAddToCart?: (id: string | number) => void;
}

export default function MenuCard({
  id,
  name,
  price,
  images,
  onAddToCart,
}: MenuCardProps) {
  return (
    <div
      key={id}
      className="relative group bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="relative w-full aspect-[4/3]">
        <img
          src={images?.[0] || "/placeholder.jpg"}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <button
          onClick={() => onAddToCart?.(id)}
          className="absolute top-3 right-3 bg-orange-500 text-white p-2 rounded-full shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600"
          title="Thêm vào giỏ hàng"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex flex-col justify-between text-center sm:text-left">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
          {name}
        </h3>
        <p className="text-orange-600 font-bold mt-1 text-sm sm:text-base">
          {price.toLocaleString()}₫
        </p>
      </div>
    </div>
  );
}
