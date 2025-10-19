import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  const tables = await prisma.table.findMany({
    select: { id: true, name: true, qr: true },
  });
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
