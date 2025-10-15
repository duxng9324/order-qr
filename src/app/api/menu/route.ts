import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
  const items = await prisma.menuItem.findMany();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const authHeader = await req.headers.get("authorization");
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
        { error: "Bạn không có quyền!" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const images = formData.getAll("images") as File[];
    const categoryIds = (formData.getAll("categories") as string[]) || [];

    if (!name || !price) {
      return NextResponse.json(
        { error: "Thiếu thông tin món ăn!" },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "menu_items" }, (err, result) =>
            err ? reject(err) : resolve(result)
          )
          .end(buffer);
      });
      imageUrls.push(uploadResult.secure_url);
    }

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        images: imageUrls,
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      include: {
        categories: { include: { category: true } },
      },
    });
    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Lỗi khi tạo món ăn:", error);
    return NextResponse.json({ error: "Lỗi server!" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
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

    const id = await params.id;
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
  { params }: { params: { id: string } }
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

    const id = await params.id
    const delItem = await prisma.menuItem.delete({
      where: { id },
    });
    return NextResponse.json(delItem);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi xóa món!" }, { status: 500 });
  }
}
