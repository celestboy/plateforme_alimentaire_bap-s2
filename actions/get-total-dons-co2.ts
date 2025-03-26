"use server";

import { calculateCO2Saved } from "@/utils/co2Calculator";
import DonsControllerInstance from "../controllers/DonsController";

interface CO2Stats {
  totalWeightKg: number;
  totalCO2Saved: number;
  totalDonations: number;
}

export default async function getTotalCO2Stats(): Promise<CO2Stats> {
  try {
    const allDonations = await DonsControllerInstance.index();

    // Calculate totals
    let totalWeightKg = 0;
    let totalCO2Saved = 0;

    // Process each donation to calculate CO2 savings
    for (const donation of allDonations) {
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
      totalDonations: allDonations.length,
    };
  } catch (error) {
    console.error("Error calculating total CO2 stats:", error);
    return {
      totalWeightKg: 0,
      totalCO2Saved: 0,
      totalDonations: 0,
    };
  }
}
