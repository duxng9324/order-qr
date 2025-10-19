import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { tableId, userId, note, items } = await req.json();

    if (!tableId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Thiếu thông tin order" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        tableId,
        userId: userId || undefined,
        note: note || "",
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            note: item.note || "",
            menuItem: {
              connect: { id: item.menuId },
            },
          })),
        },
      },
      include: {
        items: true,
        table: true,
        user: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Lỗi tạo order:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Không có token" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Token không hợp lệ!" }, { status: 401 });
  }

  if (decoded.role !== "ADMIN" && decoded.role !== "STAFF") {
    return NextResponse.json(
      { error: "Bạn không có quyền chỉnh sửa!" },
      { status: 403 }
    );
  }
  const orders = await prisma.order.findMany({
    include: {
      table: true, 
      items: {
        include: {
          menuItem: true, 
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(orders);
}
