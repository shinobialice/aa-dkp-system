"use server";

import prisma from "@/lib/db";

export async function getNews() {
  return prisma.news.findMany({
    orderBy: { date: "desc" },
  });
}

export async function createNews(title: string, content: string) {
  return prisma.news.create({
    data: { title, content },
  });
}

export async function updateNews(id: number, title: string, content: string) {
  return prisma.news.update({
    where: { id },
    data: { title, content },
  });
}

export async function deleteNews(id: number) {
  return prisma.news.delete({
    where: { id },
  });
}
