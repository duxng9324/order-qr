import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: {params: Promise<{itemId : string}>}
) {
  try {
    const {itemId} = await context.params;
    const orderItem = await prisma.orderItem.findMany({
      where: { id: itemId },
      select: {
        id: true,
        orderId: true,
        order: true,
        menuItemId: true,
        menuItem: true,
        quantity: true,
      },
    });
    return NextResponse.json(orderItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách món" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: {params: Promise<{itemId : string}>}
) {
  try {
    const {itemId} = await context.params;
    const { quantity } = await req.json();
    const updateOrderItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { quantity },
      select: {
        id: true,
        orderId: true,
        order: true,
        menuItemId: true,
        menuItem: true,
        quantity: true,
      },
    });
    return NextResponse.json(updateOrderItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi cập nhật món!" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: {params: Promise<{itemId : string}>}
) {
  try {
    const {itemId} = await context.params;
    const delOrderItem = await prisma.orderItem.delete({
      where: { id: itemId },
    });
    return NextResponse.json(delOrderItem);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi xóa món!" }, { status: 500 });
  }
}
