"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/composable/services/authServices";
import { getMe } from "@/composable/services/userServices";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({ email, password });

      if (!res?.token)
        throw new Error("Đăng nhập thất bại! Sai tài khoản hoặc mật khẩu.");

      const me = await getMe(res.token);

      localStorage.setItem("token", res.token);
      localStorage.setItem("name", me?.name);
      localStorage.setItem("email", me?.email);
      localStorage.setItem("phone", me?.phone);

      Cookies.set("token", res.token, {
        expires: 1, // 1 ngày
        path: "/", // cookie áp dụng toàn site
        secure: process.env.NODE_ENV === "production", // HTTPS only nếu production
        sameSite: "strict",
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-amber-700 mb-6">
          Đăng nhập 🍽️
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 text-center p-2 mb-4 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Chưa có tài khoản?{" "}
          <a
            href="/auth/register"
            className="text-amber-600 font-medium hover:underline"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
