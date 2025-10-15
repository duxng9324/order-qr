import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const table = await prisma.table.findUnique({
      where: { id },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch table" }, { status: 500 });
  }
}