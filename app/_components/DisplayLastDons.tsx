import displayDons from "@/actions/displayDons";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Don {
	don_id: number;
	title: string;
	description: string;
	category: string;
	img_url: string;
	limit_date: Date;
}

export default function DisplayLastThree() {
	const [isLoading, setIsLoading] = useState(false);
	const [dons, setDons] = useState<Don[]>([]);

	const selectLastDons = (dons: Don[]) => {
		return dons.slice(-3).reverse(); // Prend les 3 derniers et les met dans l'ordre du plus récent au plus ancien
	};

	const fetchArticles = async () => {
		try {
			setIsLoading(true);
			const fetchedDons = await displayDons();
			setDons(selectLastDons(fetchedDons));
		} catch (error) {
			console.error("Erreur lors de la récupération des articles :", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchArticles();
	}, []);

	return (
		<div>
			{isLoading ? (
				<p>Chargement...</p>
			) : (
				<div className="flex gap-3">
					{dons.length === 0 ? (
						<p>Aucun article disponible.</p>
					) : (
						dons.map((don) => (
							<Link
								href={`/dons/${don.don_id}`}
								key={don.don_id}>
								<div className="bg-white rounded-xl w-[400px]">
									<Image
										className="w-full object-cover rounded-2xl aspect-video"
										width={512}
										height={512}
										src={don.img_url}
										alt={don.title}
									/>
									<div className="flex justify-between">
										<h2 className="text-lg text-left font-Montserrat font-semibold ml-2 mt-2">
											{don.title}
										</h2>
										<h2 className="text-lg text-right font-Montserrat font-semibold ml-2 mt-2">
											{don.limit_date.toLocaleDateString()}
										</h2>
									</div>
								</div>
							</Link>
						))
					)}
				</div>
			)}
		</div>
	);
}
