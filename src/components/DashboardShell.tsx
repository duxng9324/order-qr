"use client";

import { ReactNode, useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Settings,
  Home,
  UtensilsCrossed,
  BarChart3,
  Table,
  Wine,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/dashboard", label: "Trang chủ", icon: Home },
    { href: "/dashboard/tables", label: "Bàn ăn", icon: Wine},
    { href: "/dashboard/orders", label: "Đơn hàng", icon: UtensilsCrossed },
    { href: "/dashboard/menu", label: "Món ăn", icon: Table },
    { href: "/dashboard/statistics", label: "Thống kê", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Cài đặt", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar top */}
      <div className="navbar bg-base-100 shadow-sm px-4 sticky top-0 z-30">
        <div className="flex-1">
          <button
            className="btn btn-ghost btn-square lg:hidden z-20"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
          <a href="/dashboard" className="text-xl font-bold text-amber-500 ml-2">
            QRFood
          </a>
        </div>

        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Admin avatar"
                  src="https://api.dicebear.com/9.x/adventurer/svg?seed=Admin"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/dashboard/profile">Hồ sơ</a>
              </li>
              <li>
                <a href="/dashboard/settings">Cài đặt</a>
              </li>
              <li>
                <a href="/logout" className="text-error">
                  Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Container */}
      <div className="flex flex-1 fixed mt-[60px] w-full">
        {/* Overlay cho mobile khi mở sidebar */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`bg-base-100 w-64 p-4 shadow-md fixed lg:sticky top-0 left-0 h-screen z-30 transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <nav className="space-y-2">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <a
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors 
                    ${
                      active
                        ? "bg-amber-500 text-white"
                        : "hover:bg-base-200 text-base-content"
                    }`}
                >
                  <Icon size={18} /> {label}
                </a>
              );
            })}

            <hr />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-2 rounded-lg text-error hover:bg-error/10 w-full"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
