import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    if (!orderId || orderId.length !== 24) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { menuItem: true },
        },
        table: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: {params: Promise<{orderId : string}>}
) {
  const authHeader = request.headers.get("authorization");
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
    return NextResponse.json(
      { error: "Bạn không có quyền chỉnh sửa" },
      { status: 403 }
    );
  }
  const { status } = await request.json();
  const {orderId} = await context.params;

  const updatedOrder = await prisma.order.update({
    where: { id: orderId},
    data: { status },
  });

  return NextResponse.json(updatedOrder);
}

export async function DELETE(
  req: Request,
  context: {params: Promise<{orderId : string}>}
) {
  try {
    const {orderId} = await context.params;
    const delOrder = await prisma.order.delete({
      where: { id: orderId },
    });
    return NextResponse.json(delOrder);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi xóa order!" }, { status: 500 });
  }
}
