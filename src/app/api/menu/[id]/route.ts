import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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