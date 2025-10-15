import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, {params}: {params: {id: string}}) {
    try {
        const id = await params.id;
        const order = await prisma.order.findUnique({
            where: {id},
            select: {id: true, tableId: true, table: true, userId: true, user: true, status: true, items: true, note: true}
        })
        if(!order){
            return NextResponse.json({error: "Không tìm thấy order!" }, {status: 404})
        }
        return NextResponse.json(order); 
    } catch (error){
        return NextResponse.json({ error: "Lỗi khi lấy thông tin order!" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  const id = await params.id;

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updatedOrder);
}

export async function DELETE(req: Request, {params}: {params: {id: string}}) {
    try {
        const id = await params.id;
        const delOrder = await prisma.order.delete({
            where: {id}
        })
        return NextResponse.json(delOrder)
    } catch (error){
        return NextResponse.json({ error: "Lỗi khi xóa order!" }, { status: 500 });
    }
}