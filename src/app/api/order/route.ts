import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { tableId, userId, note, items } = await req.json();

    if (!tableId || !items || items.length === 0) {
      return NextResponse.json({ error: "Thiếu thông tin order" }, { status: 400 });
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
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true, table: true, user: true },
  });
  return NextResponse.json(orders);
}
