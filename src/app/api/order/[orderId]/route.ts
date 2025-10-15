import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const id = params.orderId;

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
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
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const { status } = await req.json();
  const id = await params.orderId;

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updatedOrder);
}

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const id = await params.orderId;
    const delOrder = await prisma.order.delete({
      where: { id },
    });
    return NextResponse.json(delOrder);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi xóa order!" }, { status: 500 });
  }
}
