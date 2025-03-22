"use server";

import prisma from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

interface Don {
  don_id: number;
  title: string;
  description: string;
  category: string;
  quantity: number;
  limit_date: Date;
  img_url: string;
}

interface GetDonsParams {
  query?: string;
  category?: string;
}

export async function getDons({ query, category }: GetDonsParams = {}): Promise<
  Don[]
> {
  try {
    const searchTerms = query?.trim().split(" ") || [];

    // Define proper Prisma where clause type
    const whereConditions: Prisma.DonsWhereInput = {};

    // Add search term conditions if query is provided
    if (searchTerms.length > 0) {
      whereConditions.OR = searchTerms.map((term) => ({
        OR: [
          { title: { contains: term.toLowerCase() } },
          { description: { contains: term.toLowerCase() } },
        ],
      }));
    }

    // Add category filter if provided
    if (category) {
      // Combine with existing conditions if any
      if (whereConditions.OR) {
        // Need to wrap existing OR conditions to combine with AND
        whereConditions.AND = [
          { OR: whereConditions.OR as Prisma.DonsWhereInput[] },
          { category: category },
        ];
        delete whereConditions.OR;
      } else {
        whereConditions.category = category;
      }
    }

    const dons = await prisma.dons.findMany({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    });

    return dons;
  } catch (error) {
    console.error("❌ Erreur Prisma:", error);
    return [];
  }
}
