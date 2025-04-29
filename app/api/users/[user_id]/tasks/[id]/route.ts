import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { user_id: string; id: string } }
) {
  const { id } = await params;

  await prisma.tasks.delete({
    where: {
      id: Number(id),
    },
  });

  return new Response(null, { status: 204 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { user_id: string; id: string } }
) {
  const { user_id, id } = await params;
  const body = await req.json();

  const updatedTask = await prisma.tasks.update({
    where: { id: Number(id), user_id: Number(user_id) },
    data: {
      name: body.name,
      created_at: body.created_at,
      completed_at: body.completed_at,
    },
  });

  return NextResponse.json({ message: "Задание обновлено" });
}