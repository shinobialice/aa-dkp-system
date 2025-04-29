import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//getting tasks
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const userId = parseInt(url.pathname.split("/")[3], 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
  }

  const tasks = await prisma.tasks.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      user_id: true,
      name: true,
      created_at: true,
      completed_at: true,
    },
  });

  return NextResponse.json(tasks);
}

// creating new task
export async function POST(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const { user_id: userId } = await params;

  try {
    const body = await request.json();
    const { name, created_at, completed_at } = body;
    const task = await prisma.tasks.create({
      data: {
        user_id: parseInt(userId, 10),
        name,
        created_at: new Date(created_at),
        completed_at: completed_at ? new Date(completed_at) : null,
      },
    });

    return Response.json(task, { status: 201 });
  } catch (error) {
    console.error("Ошибка создания задания:", error);
    return Response.json(
      { message: "Ошибка при создании задания" },
      { status: 500 }
    );
  }
}
