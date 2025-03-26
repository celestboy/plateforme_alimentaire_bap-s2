"use server";

import { calculateCO2Saved } from "@/utils/co2Calculator";
import DonsControllerInstance from "../controllers/DonsController";

interface CO2Stats {
  totalWeightKg: number;
  totalCO2Saved: number;
  totalDonations: number;
  history?: {
    date: string;
    weightKg: number;
    co2Saved: number;
  }[];
}

export default async function getUserCO2Stats(
  userId: number
): Promise<CO2Stats> {
  try {
    const userDonations = await DonsControllerInstance.getDonByUser(userId);

    // Calculate totals
    let totalWeightKg = 0;
    let totalCO2Saved = 0;

    // Process each donation to calculate CO2 savings
    for (const donation of userDonations) {
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
    const history = userDonations.map((donation) => ({
      date: donation.publishedAt.toISOString().split("T")[0],
      weightKg: calculateCO2Saved(
        donation.title,
        donation.description || "",
        donation.category,
        donation.quantity
      ).weightKg,
      co2Saved: calculateCO2Saved(
        donation.title,
        donation.description || "",
        donation.category,
        donation.quantity
      ).co2Saved,
    }));

    return {
      totalWeightKg: parseFloat(totalWeightKg.toFixed(2)),
      totalCO2Saved: parseFloat(totalCO2Saved.toFixed(2)),
      totalDonations: userDonations.length,
      history,
    };
  } catch (error) {
    console.error("Error calculating user CO2 stats:", error);
    return {
      totalWeightKg: 0,
      totalCO2Saved: 0,
      totalDonations: 0,
      history: [],
    };
  }
}
