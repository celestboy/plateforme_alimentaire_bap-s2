// app/publish/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    measureType: "poids", // valeur par défaut
    measureValue: "",
    expirationDate: "",
    meetingPoints: [] as string[],
    photo: "", // contiendra la chaîne base64
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Options prédéfinies pour la catégorie et les points de rendez-vous
  const categories = [
    "Fruits",
    "Légumes",
    "Viandes",
    "Produits laitiers",
    "Boulangerie",
  ];
  const meetingPointsOptions = ["Point A", "Point B", "Point C"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMeetingPointsChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      meetingPoints: selectedOptions,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérifier que tous les champs requis sont remplis
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.measureValue ||
      !formData.expirationDate ||
      formData.meetingPoints.length === 0 ||
      !formData.photo
    ) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    // Préparation des données à envoyer (on convertit le tableau des points en chaîne CSV)
    const dataToSend = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      measure_type: formData.measureType,
      measure_value: parseFloat(formData.measureValue),
      expiration_date: formData.expirationDate,
      meeting_points: formData.meetingPoints.join(","),
      photo: formData.photo,
    };

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const result = await res.json();
      if (result.success) {
        setMessage("Annonce publiée avec succès !");
        // Redirection vers la page d'accueil après 3 secondes (ou vous pouvez rediriger ailleurs)
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setError(result.error || "Erreur lors de la publication.");
      }
    } catch (err) {
      console.error("Erreur lors de la publication:", err);
      setError("Erreur lors de la publication.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h1>Publier une annonce de don alimentaire</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Titre */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Titre:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        {/* Description */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        {/* Catégorie */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Catégorie:
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            >
              <option value="">-- Sélectionner une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>
        {/* Type de mesure et valeur */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Type de mesure:
            <div>
              <label>
                <input
                  type="radio"
                  name="measureType"
                  value="poids"
                  checked={formData.measureType === "poids"}
                  onChange={handleChange}
                />
                Poids
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  name="measureType"
                  value="quantité"
                  checked={formData.measureType === "quantité"}
                  onChange={handleChange}
                />
                Quantité
              </label>
            </div>
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            {formData.measureType === "poids" ? "Poids (en kg):" : "Quantité:"}
            <input
              type="number"
              step="0.01"
              name="measureValue"
              value={formData.measureValue}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        {/* Date limite */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Date limite de l'annonce:
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        {/* Points de rendez-vous */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Points de rendez-vous:
            <select
              name="meetingPoints"
              multiple
              value={formData.meetingPoints}
              onChange={handleMeetingPointsChange}
              required
              style={{ width: "100%", height: "100px" }}
            >
              {meetingPointsOptions.map((point) => (
                <option key={point} value={point}>
                  {point}
                </option>
              ))}
            </select>
          </label>
        </div>
        {/* Photo */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Photo:
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <button type="submit">Publier l'annonce</button>
      </form>
    </div>
  );
}
