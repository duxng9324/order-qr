"use client";

import { register } from "@/composable/services/authServices";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function () {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (password === verify) {
        const res = await register({ name, email, phone, password });
        if (!res?.token)
          throw new Error(
            "Đăng ký thất bại! Email hoặc số điện thoại đã được sử dụng!"
          );

        localStorage.setItem("token", res.token);
        localStorage.setItem("name", res?.user?.name);
        localStorage.setItem("email", res?.user?.email);
        localStorage.setItem("phone", res?.user?.phone);

        Cookies.set("token", res.token, {
          expires: 1, // 1 ngày
          path: "/", // cookie áp dụng toàn site
          secure: process.env.NODE_ENV === "production", // HTTPS only nếu production
          sameSite: "strict",
        });

        router.push("/");
      } else {
        setError("Mật khẩu không khớp!");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-yellow-200 px-4 flex items-center justify-center ">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center text-amber-700 mb-6">
            Đăng ký tài khoản 🍽️
          </h2>

          {error && (
            <p className="bg-red-100 text-red-600 text-center p-2 mb-4 rounded-md">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên của bạn:{" "}
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Nhập tên của bạn!"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email của bạn:{" "}
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Nhập email của bạn!"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại của bạn:{" "}
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Nhập số điện thoại của bạn!"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu của bạn:{" "}
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Nhập mật khẩu của bạn!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu:{" "}
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Nhập mật khẩu của bạn một lần nữa!"
                value={verify}
                onChange={(e) => setVerify(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Đang đăng ký" : "Đăng ký"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Bạn đã có tài khoản?{" "}
            <a
              href="/auth/login"
              className="text-amber-600 font-medium hover:underline"
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
