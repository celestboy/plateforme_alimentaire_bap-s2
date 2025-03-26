"use server";

import prisma from "@/prisma/prisma";
import { calculateCO2Saved } from "@/utils/co2Calculator";

interface CO2Stats {
  totalWeightKg: number;
  totalCO2Saved: number;
  totalDonations: number;
}

export default async function getUserCO2Stats(
  userId: number
): Promise<CO2Stats> {
  try {
    const userDonations = await prisma.dons.findMany({
      where: {
        donneur_id: userId,
      },
    });

    const receivedDonations = await prisma.dons.findMany({
      where: {},
    });

    // Combine all donations (made and received)
    const allUserDonations = [...userDonations, ...receivedDonations];

    // Calculate totals
    let totalWeightKg = 0;
    let totalCO2Saved = 0;

    // Process each donation to calculate CO2 savings
    for (const donation of allUserDonations) {
      // Calculate CO2 if not already calculated
      const co2Result = calculateCO2Saved(
        donation.title,
        donation.description || "",
        donation.category,
        donation.quantity
      );

      totalWeightKg += co2Result.weightKg;
      totalCO2Saved += co2Result.co2Saved;
    }

    return {
      totalWeightKg: parseFloat(totalWeightKg.toFixed(2)),
      totalCO2Saved: parseFloat(totalCO2Saved.toFixed(2)),
      totalDonations: allUserDonations.length,
    };
  } catch (error) {
    console.error("Error calculating user CO2 stats:", error);
    return {
      totalWeightKg: 0,
      totalCO2Saved: 0,
      totalDonations: 0,
    };
  }
}
