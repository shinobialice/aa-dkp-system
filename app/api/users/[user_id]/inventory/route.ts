import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const { user_id: userId } =  await params;

  try {
    const body = await request.json();
    const { name, type, quality } = body;

    const newInventoryItem = await prisma.userInventory.create({
      data: {
        user_id: parseInt(userId, 10),
        name,
        type,
        quality: quality || null,
        created_at: new Date(), // обязательно добавляем дату
      },
    });

    return NextResponse.json(newInventoryItem, { status: 201 });
  } catch (error) {
    console.error("Ошибка создания инвентаря:", error);
    return NextResponse.json({ message: "Ошибка при создании инвентаря" }, { status: 500 });
  }
}