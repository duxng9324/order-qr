import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

  const table = await prisma.table.create({
    data,
    select: { id: true, name: true },
  });

  const baseUrl = BASE_URL;
  const qrUrl = `${baseUrl}/menu/${table.id}`;
  const qrCode = await QRCode.toDataURL(qrUrl);

  const qr = await prisma.qR.create({
    data: {
      url: qrCode,
      table: {
        connect: { id: table.id },
      },
    },
  });

  return NextResponse.json({ table, qr });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
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

    const id = await params.id;
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
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
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
