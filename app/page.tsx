"use client";

import React from "react";
// app/page.tsx

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Annonce {
	id: number;
	title: string;
	description: string;
	category: string;
	measure_type: "poids" | "quantité";
	measure_value: number;
	expiration_date: string;
	meeting_points: string;
	photo: string;
	publication_date: string;
}

export default function HomePage() {
	const searchParams = useSearchParams();
	const [showPopup, setShowPopup] = useState(false);
	const [annonces, setAnnonces] = useState<Annonce[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Affichage pop-up si connexion a réussi
	useEffect(() => {
		if (searchParams.get("success") === "login") {
			setShowPopup(true);
			const timer = setTimeout(() => {
				setShowPopup(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [searchParams]);

	// Récupération des annonces via l'API
	useEffect(() => {
		async function fetchAnnonces() {
			try {
				const res = await fetch("/api/annonces");
				const data = await res.json();
				if (data.success) {
					setAnnonces(data.annonces);
				} else {
					setError(data.error || "Erreur lors du chargement des annonces.");
				}
			} catch (error) {
				console.error("Erreur lors du chargement des annonces:", error);
				setError("Erreur lors du chargement des annonces.");
			} finally {
				setLoading(false);
			}
		}
		fetchAnnonces();
	}, []);

	return (
		<div>
			{showPopup && (
				<div
					style={{
						position: "fixed",
						top: "20px",
						right: "20px",
						backgroundColor: "#4caf50",
						color: "white",
						padding: "1rem",
						borderRadius: "5px",
						boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
					}}>
					Connecté avec succès !
				</div>
			)}

			<section className="hero bg-cover bg-center mt-[60px] text-white h-[600px] w-full flex flex-col items-center justify-center">
				{/* Conteneur principal */}
				<div className="flex items-center justify-center w-full px-10">
					{/* Bloc de gauche avec CTA */}
					<div className="w-1/2 flex justify-center">
						<div className="bg-white text-black rounded-lg p-5 w-80">
							<p className="text-lg font-bold mb-4">
								Vous aussi, agissez contre le gaspillage
							</p>
							<div className="flex gap-4">
								<button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-gray-300">
									En savoir plus
								</button>
								<button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-gray-300">
									Commencer
								</button>
							</div>
						</div>
					</div>

					{/* Bloc de droite avec le texte */}
					<div className="w-1/2 text-2xl font-semibold text-justify">
						<h1 className="max-w-lg mx-auto text-4xl/[50px]">
							La nouvelle initiative contre le gaspillage alimentaire à
							Rueil-Malmaison
						</h1>
					</div>
				</div>

				{/* Barre de recherche */}
				<div className="mt-20 flex flex-col justify-center">
					<div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-[500px]">
						<i className="fas fa-map-marker-alt text-black text-lg mr-3"></i>
						<input
							type="text"
							placeholder="Adresse, Quartier..."
							className="flex-1 outline-none text-black text-lg"
						/>
						<div className="h-5 w-px bg-gray-300 mx-3"></div>
						<i className="fas fa-search text-black text-lg"></i>
					</div>
					<p className="ml-4">Cherchez des annonces selon votre localisation</p>
				</div>
			</section>

			<section className="text-center">
				<h2 className="text-4xl font-bold m-12">Annonces pertinentes</h2>
			</section>

			{loading ? (
				<p>Chargement des annonces...</p>
			) : error ? (
				<p style={{ color: "red" }}>{error}</p>
			) : (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
						gap: "7rem",
						textAlign: "center",
						padding: "5rem",
					}}>
					{annonces.map((annonce) => (
						<div
							key={annonce.id}
							style={{
								border: "1px solid #ccc",
								borderRadius: "8px",
								padding: "1rem",
							}}>
							<h2>{annonce.title}</h2>
							<Image
								src={annonce.photo}
								alt={annonce.title}
								width={500}
								height={300}
								style={{ borderRadius: "5px" }}
								layout="responsive"
							/>
							<p>
								<strong>Description:</strong> {annonce.description}
							</p>
							<p>
								<strong>Catégorie:</strong> {annonce.category}
							</p>
							<p>
								<strong>
									{annonce.measure_type === "poids" ? "Poids" : "Quantité"}:
								</strong>{" "}
								{annonce.measure_value}{" "}
								{annonce.measure_type === "poids" ? "kg" : ""}
							</p>
							<p>
								<strong>Date limite:</strong>{" "}
								{new Date(annonce.expiration_date).toLocaleDateString()}
							</p>
							<p>
								<strong>Points de rendez-vous:</strong> {annonce.meeting_points}
							</p>
							<p>
								<strong>Publié le:</strong>{" "}
								{new Date(annonce.publication_date).toLocaleString()}
							</p>
						</div>
					))}
				</div>
			)}

			<section>
				<h3 className="text-4xl text-center m-8">
					Dites non au{" "}
					<span className="text-[#084784]">gaspillage alimentaire</span>
				</h3>

				<div className="flex flex-wrap gap-5 m-12">
					<article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center box-border">
						<p className="text-[#084784] text-lg mb-2">
							Liste facile des articles
						</p>
						<p>
							Repertoriez rapidement les articles alimentaires en surplus de
							votre garde-manger ou de votre refrigerateur, pour que les autres
							membres de votre communaute puissent voir ce qui est disponible.
						</p>
					</article>
					<article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center box-border">
						<p className="text-[#084784] text-lg mb-2">
							Liste facile des articles
						</p>
						<p>
							Repertoriez rapidement les articles alimentaires en surplus de
							votre garde-manger ou de votre refrigerateur, pour que les autres
							membres de votre communaute puissent voir ce qui est disponible.
						</p>
					</article>
					<article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center box-border">
						<p className="text-[#084784] text-lg mb-2">
							Liste facile des articles
						</p>
						<p>
							Repertoriez rapidement les articles alimentaires en surplus de
							votre garde-manger ou de votre refrigerateur, pour que les autres
							membres de votre communaute puissent voir ce qui est disponible.
						</p>
					</article>
					<article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center box-border">
						<p className="text-[#084784] text-lg mb-2">
							Liste facile des articles
						</p>
						<p>
							Repertoriez rapidement les articles alimentaires en surplus de
							votre garde-manger ou de votre refrigerateur, pour que les autres
							membres de votre communaute puissent voir ce qui est disponible.
						</p>
					</article>
					<article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center box-border">
						<p className="text-[#084784] text-lg mb-2">
							Liste facile des articles
						</p>
						<p>
							Repertoriez rapidement les articles alimentaires en surplus de
							votre garde-manger ou de votre refrigerateur, pour que les autres
							membres de votre communaute puissent voir ce qui est disponible.
						</p>
					</article>
					<article className="flex-1 basis-full sm:basis-[calc(50%-20px)] lg:basis-[calc(33.333%-20px)] p-16 text-center box-border">
						<p className="text-[#084784] text-lg mb-2">
							Liste facile des articles
						</p>
						<p>
							Repertoriez rapidement les articles alimentaires en surplus de
							votre garde-manger ou de votre refrigerateur, pour que les autres
							membres de votre communaute puissent voir ce qui est disponible.
						</p>
					</article>
				</div>
			</section>

			<section>
				<h3 className="text-4xl text-center m-8">
					Localisation en temps réel,{" "}
					<span className="text-[#084784]">avec de vraies personnes</span>
				</h3>

				<div className="m-16 flex">
					<Image
						src="/images/mairie.jpeg"
						alt=""
						width={1200}
						height={600}
						className="w-1/2 p-12"
					/>

					<div className="flex flex-col justify-evenly text-lg">
						<article>
							<p className="text-[#084784]">
								Repertorier facilement les aliments excedentaires
							</p>
							<p>
								Ajoutez rapidement des articles alimentaires excedentaires de
								votre cuisine, les rendant disponibles pour que les autres les
								trouvent et contribuent a reduire le gaspillage.
							</p>
						</article>
						<article>
							<p className="text-[#084784]">
								Repertorier facilement les aliments excedentaires
							</p>
							<p>
								Ajoutez rapidement des articles alimentaires excedentaires de
								votre cuisine, les rendant disponibles pour que les autres les
								trouvent et contribuent a reduire le gaspillage.
							</p>
						</article>
						<article>
							<p className="text-[#084784]">
								Repertorier facilement les aliments excedentaires
							</p>
							<p>
								Ajoutez rapidement des articles alimentaires excedentaires de
								votre cuisine, les rendant disponibles pour que les autres les
								trouvent et contribuent a reduire le gaspillage.
							</p>
						</article>
					</div>
				</div>
			</section>
		</div>
	);
}
