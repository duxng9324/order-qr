# 🍽️ Next QR Food

Dự án **Next QR Food** là một hệ thống quản lý nhà hàng hiện đại, cho phép **khách hàng quét mã QR** tại bàn để **xem menu, đặt món, thanh toán**, và giúp **nhân viên hoặc quản trị viên** quản lý **đơn hàng, bàn, menu, người dùng** trong hệ thống.

---

## 🚀 Tính năng nổi bật

- ✅ Đăng nhập / Đăng ký với JWT Authentication  
- ✅ Phân quyền người dùng (`ADMIN`, `STAFF`, `CUSTOMER`)  
- ✅ Quản lý thực đơn (Menu Management)  
- ✅ Quản lý bàn ăn, tạo mã QR tự động cho từng bàn  
- ✅ Đặt món, cập nhật số lượng, ghi chú, thanh toán trực tuyến  
- ✅ Giao diện Dashboard riêng cho quản trị viên / nhân viên  
- ✅ Thống kê doanh thu, đơn hàng  
- ✅ API RESTful sử dụng **Prisma ORM** và **Next.js Route Handlers**

---

## 🧱 Công nghệ sử dụng

| Công nghệ | Mục đích |
|------------|----------|
| **Next.js 14** | Framework chính (App Router + SSR + Middleware) |
| **React 18** | Xây dựng giao diện người dùng |
| **Tailwind CSS** | Thiết kế UI nhanh, responsive |
| **Prisma ORM** | Làm việc với cơ sở dữ liệu |
| **JWT (jsonwebtoken)** | Xác thực người dùng |
| **Lucide React** | Icon đẹp và nhẹ |
| **Cookie.js** | Lưu và quản lý token đăng nhập |
| **TypeScript** | Tăng độ ổn định và tránh lỗi |
| **QRCode Generator** | Tạo mã QR cho từng bàn |

---

## ⚙️ Cài đặt & Chạy dự án

### 1️⃣ Clone dự án
```bash
git clone https://github.com/yourusername/next-qr-food.git
cd next-qr-food
```

### 2️⃣ Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### 3️⃣ Cấu hình biến môi trường `.env`
Tạo file `.env` ở thư mục gốc:
```bash
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/qrfood"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4️⃣ Khởi tạo Prisma & seed dữ liệu mẫu
```bash
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts
```

### 5️⃣ Chạy dự án
```bash
npm run dev
```
Truy cập tại: 👉 **http://localhost:3000**

---

## 🗂️ Cấu trúc thư mục

```
next-qr-food/
├── prisma/                    # Cấu hình & khởi tạo database
│   ├── schema.prisma          # Mô hình dữ liệu (User, Order, Table, Menu, ...)
│   └── seed.ts                # Dữ liệu mẫu ban đầu
│
├── public/                    # Ảnh, icon, file tĩnh
│
├── src/
│   ├── app/
│   │   ├── (public)/          # Giao diện dành cho khách hàng
│   │   ├── (dashboard)/       # Khu vực quản trị (ADMIN / STAFF)
│   │   ├── api/               # Tất cả route API
│   │   ├── globals.css        # CSS toàn cục
│   │   └── favicon.ico
│   │
│   ├── components/            # Các component dùng chung
│   ├── composable/            # Các service & hàm tiện ích
│   ├── context/               # React Context (Cart, Order)
│   └── lib/                   # Kết nối Prisma client
│
├── next.config.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🧩 Phân quyền người dùng

| Role | Quyền truy cập |
|------|----------------|
| **ADMIN** | Toàn quyền quản lý hệ thống |
| **STAFF** | Quản lý đơn hàng & bàn ăn |
| **CUSTOMER** | Đặt món & thanh toán qua QR |

---

## 🔒 Middleware (Bảo vệ route)

- `/dashboard/*` → Chỉ cho phép `ADMIN` và `STAFF`
- `/dashboard/staff/*` → Chỉ `ADMIN` có quyền truy cập  
- Sử dụng **JWT token** lưu trong **cookie**, kiểm tra qua **middleware.ts**

---

## 🧑‍💻 Người phát triển

**Tác giả:** Dũng Trần  
**Framework:** [Next.js](https://nextjs.org/)  
**ORM:** [Prisma](https://www.prisma.io/)  
**UI:** [Tailwind CSS](https://tailwindcss.com/)

---

## 📜 Giấy phép

MIT License © 2025 — Next QR Food
