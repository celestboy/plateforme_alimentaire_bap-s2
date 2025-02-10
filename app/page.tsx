// app/page.tsx
"use client";

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

  // Affichage du pop-up si la connexion a réussi (paramètre success=login dans l'URL)
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
    <div style={{ padding: "2rem" }}>
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
          }}
        >
          Connecté avec succès !
        </div>
      )}
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Bienvenue sur notre plateforme alimentaire
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555", textAlign: "center" }}>
        Découvrez nos dons alimentaires.
      </p>
      <hr style={{ margin: "2rem 0" }} />
      {loading ? (
        <p>Chargement des annonces...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {annonces.map((annonce) => (
            <div
              key={annonce.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <h2>{annonce.title}</h2>
              <img
                src={annonce.photo}
                alt={annonce.title}
                style={{ width: "100%", height: "auto", borderRadius: "5px" }}
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
    </div>
  );
}
