import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const order = await prisma.order.create({ data });
  return NextResponse.json(order);
}

export async function GET() {
  const items = await prisma.orderItem.findMany();
  return NextResponse.json(items);
}
