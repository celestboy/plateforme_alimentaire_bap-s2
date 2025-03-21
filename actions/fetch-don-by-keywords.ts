"use server";

import prisma from "@/prisma/prisma";

interface Don {
  don_id: number;
  title: string;
  description: string;
  category: string;
  quantity: number;
  limit_date: Date;
  img_url: string;
}

export async function getDons(query?: string): Promise<Don[]> {
  try {
    const searchTerms = query?.trim().split(" ") || [];

    const dons = await prisma.dons.findMany({
      where: searchTerms.length
        ? {
            OR: searchTerms.map((term) => ({
              OR: [
                { title: { contains: term.toLowerCase() } },
                { description: { contains: term.toLowerCase() } },
              ],
            })),
          }
        : undefined,
    });

    return dons;
  } catch (error) {
    console.error("❌ Erreur Prisma:", error);
    return [];
  }
}
