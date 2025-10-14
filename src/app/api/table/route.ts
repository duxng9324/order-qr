import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  const tables = await prisma.table.findMany();
  return NextResponse.json(tables);
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
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

  const data = await req.json();
  const qrCode = await QRCode.toDataURL(data.name || Date.now().toString());
  const table = await prisma.table.create({ data: { ...data, qrCode } });
  return NextResponse.json(table);
}

export async function PATCH( req: Request, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Token không hợp lệ!" }, { status: 401 });
    }

    if (decoded.role !== "ADMIN" && decoded.role !== "STAFF") {
      return NextResponse.json({ error: "Bạn không có quyền chỉnh sửa" }, { status: 403 });
    }

    const data = await req.json();
    const updateTable = await prisma.table.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updateTable);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi cập nhật bàn!" }, { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const deletedTable = await prisma.table.delete({
      where: { id },
    });

    return NextResponse.json(deletedTable);
  } catch (error) {
    console.error("Error deleting table:", error);
    return NextResponse.json(
      { error: "Không thể xoá bàn hoặc bàn không tồn tại" },
      { status: 400 }
    );
  }
}
