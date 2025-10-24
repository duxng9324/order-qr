import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(
  req: Request,
  context: {params: Promise<{userId : string}>}
) {
  try {
    const {userId} = await context.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng!" },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin người dùng!" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Thiếu token!" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền!" },
        { status: 403 }
      );
    }

    const { userId } = await context.params;
    const { role } = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi cập nhật vai trò!" },
      { status: 500 }
    );
  }
}

export async function DELETE (req: Request, context: { params: Promise<{userId: string}>}) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Thiếu token!" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền!" },
        { status: 403 }
      );
    }

    const { userId } = await context.params;
    const updatedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi xóa người dùng!" },
      { status: 500 }
    );
  }
}