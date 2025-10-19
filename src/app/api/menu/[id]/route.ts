import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch menuItem" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Không có token" }, { status: 401 });
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
        { error: "Bạn không có quyền chỉnh sửa!" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const data = await req.json();
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi cập nhật món!" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Không có token" }, { status: 401 });
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
        { error: "Bạn không có quyền xóa!" },
        { status: 403 }
      );
    }

    const { id } = await context.params
    const delItem = await prisma.menuItem.delete({
      where: { id },
    });
    return NextResponse.json(delItem);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi xóa món!" }, { status: 500 });
  }
}
