import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Thiếu tên hoặc mật khẩu!" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email người dùng đã tồn tại!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
        phone,
        role: "CUSTOMER",
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
        email: newUser.email,
        phone: newUser.phone,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "Đăng ký thành công!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra!" }, { status: 500 });
  }
}
