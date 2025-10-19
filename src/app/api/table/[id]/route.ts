import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const table = await prisma.table.findUnique({
      where: { id },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch table" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: {params: Promise<{id : string}>}
) {
  try {
    const authHeader = await req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "thiếu token!" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Token không hợp lệ!" },
        { status: 401 }
      );
    }

    if (decoded.role !== "ADMIN" && decoded.role !== "STAFF") {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa" },
        { status: 403 }
      );
    }

    const {id} = await context.params;
    const data = await req.json();
    const updateTable = await prisma.table.update({
      where: { id },
      data,
    });

    return NextResponse.json(updateTable);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi cập nhật bàn!" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Thiếu token!" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Token không hợp lệ!" },
        { status: 401 }
      );
    }

    if (decoded.role !== "ADMIN" && decoded.role !== "STAFF") {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa" },
        { status: 403 }
      );
    }

    const id =(await context.params).id;
    if (!id) {
      return NextResponse.json({ error: "Thiếu ID bàn" }, { status: 400 });
    }

    const existingOrders = await prisma.order.findMany({
      where: { tableId: id },
    });

    if (existingOrders.length > 0) {
      return NextResponse.json(
        { error: "Không thể xoá bàn vì còn đơn hàng liên kết" },
        { status: 400 }
      );
    }

    const table = await prisma.table.findUnique({
      where: { id },
      include: { qr: true },
    });

    if (!table) {
      return NextResponse.json({ error: "Bàn không tồn tại" }, { status: 404 });
    }

    if (table.qr) {
      await prisma.qR.delete({
        where: { id: table.qr.id },
      });
    }

    const deletedTable = await prisma.table.delete({
      where: { id },
    });

    return NextResponse.json(deletedTable, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting table:", error);
    return NextResponse.json(
      { error: "Không thể xoá bàn hoặc bàn không tồn tại" },
      { status: 400 }
    );
  }
}
