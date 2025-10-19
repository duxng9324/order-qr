import DashboardShell from "@/components/DashboardShell";
import "../globals.css";
import { ReactNode } from "react";


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-base-200 min-h-screen">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
