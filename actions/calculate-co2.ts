"use server";

import { calculateCO2Saved } from "@/utils/co2Calculator";

interface CO2CalculationResult {
	success: boolean;
	data?: {
		weightKg: number;
		co2Saved: number;
		identifiedProduct: string | null;
	};
	error?: string;
}

export default async function calculateDonationCO2(
	title: string,
	description: string,
	category: string,
	quantity: number
): Promise<CO2CalculationResult> {
	try {
		if (!title || !category || quantity <= 0) {
			return {
				success: false,
				error: "Données invalides pour le calcul de CO2",
			};
		}

		const result = calculateCO2Saved(title, description, category, quantity);

		// Round values
		return {
			success: true,
			data: {
				weightKg: parseFloat(result.weightKg.toFixed(2)),
				co2Saved: parseFloat(result.co2Saved.toFixed(2)),
				identifiedProduct: result.identifiedProduct,
			},
		};
	} catch (error) {
		console.error("Error calculating CO2 savings:", error);
		return {
			success: false,
			error: "Une erreur s'est produite lors du calcul des économies de CO2.",
		};
	}
}
