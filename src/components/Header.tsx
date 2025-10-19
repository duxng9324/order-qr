"use client";

import Link from "next/link";
import { ShoppingCartButton } from "@/components/ShopingCartButton";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 🔹 Kiểm tra token khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 🔹 Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <header className="bg-orange-500 text-white shadow-md fixed w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          QR<span className="text-yellow-300">Food</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
          <Link href="/" className="hover:text-yellow-300 transition">
            Trang chủ
          </Link>
          <Link href="/menu" className="hover:text-yellow-300 transition">
            Thực đơn
          </Link>
          <Link href="/contact" className="hover:text-yellow-300 transition">
            Liên hệ
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex items-center gap-1"
            >
              <LogOut size={16} /> Đăng xuất
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
            >
              Đăng nhập
            </Link>
          )}
        </nav>

        {/* Desktop Right Buttons */}
        <div className="hidden md:flex gap-4 items-center">
          <Link
            href="/order"
            className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
          >
            My order
          </Link>
          <ShoppingCartButton />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-orange-500 text-white flex flex-col items-center py-4 space-y-3 border-t border-orange-400 animate-fade-in">
          <Link
            href="/"
            className="hover:text-yellow-300 text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            🏠 Trang chủ
          </Link>
          <Link
            href="/menu"
            className="hover:text-yellow-300 text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            🍔 Thực đơn
          </Link>
          <Link
            href="/contact"
            className="hover:text-yellow-300 text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            📞 Liên hệ
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-lg font-medium"
            >
              🔓 Đăng xuất
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              🔐 Đăng nhập
            </Link>
          )}

          <Link
            href="/order"
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition text-lg font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            📦 My order
          </Link>

          <div className="pt-2">
            <ShoppingCartButton />
          </div>
        </div>
      )}
    </header>
  );
}
