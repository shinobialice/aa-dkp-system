import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const userId = parseInt(url.pathname.split("/")[3], 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "wrong id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      class: true,
      class_gear_score: true,
      secondary_class: true,
      secondary_class_gear_score: true,
      vk_name: true,
      active: true,
      is_eligible_for_salary: true,
      joined_at: true,
      tags: { 
        select: {
          id: true,
          tag: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
