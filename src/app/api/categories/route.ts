import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const authHeader = await req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Thiếu token!" }, { status: 401 });
          }
          const token = authHeader.replace("Bearer ", "");
          let decoded: any;
          try {
            decoded = jwt.verify(token, JWT_SECRET);
          } catch {
            return NextResponse.json({ error: "Token không hợp lệ!" }, { status: 401 });
          }
          if (decoded.role !== "ADMIN" && decoded.role !== "STAFF") {
            return NextResponse.json({ error: "Bạn không có quyền!" }, { status: 403 });
          }

    const { name, description } = await req.json();

    if (!name) return NextResponse.json({ error: "Thiếu tên category" }, { status: 400 });

    const newCategory = await prisma.category.create({
      data: { name, description },
    });

    return NextResponse.json(newCategory);
  } catch (err) {
    console.error("Lỗi khi tạo category:", err);
    return NextResponse.json({ error: "Lỗi server!" }, { status: 500 });
  }
}

export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}
