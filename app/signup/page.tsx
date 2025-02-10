// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"particulier" | "commercant">(
    "particulier"
  );
  const [formData, setFormData] = useState({
    username: "",
    commerce_name: "",
    adresse: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const dataToSend = {
      type: userType,
      email: formData.email,
      password: formData.password,
      ...(userType === "particulier"
        ? { username: formData.username }
        : { commerce_name: formData.commerce_name, adresse: formData.adresse }),
    };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const result = await res.json();
      if (result.success) {
        setMessage(
          "Compte créé avec succès ! Vous allez être redirigé vers la page de connexion."
        );
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(result.error || "Erreur lors de la création du compte.");
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du compte:", error);
      setError("Erreur lors de la création du compte.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h1>Création de compte</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>
          <input
            type="radio"
            name="userType"
            value="particulier"
            checked={userType === "particulier"}
            onChange={() => setUserType("particulier")}
          />
          Particulier
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="userType"
            value="commercant"
            checked={userType === "commercant"}
            onChange={() => setUserType("commercant")}
          />
          Commerçant
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        {userType === "particulier" && (
          <div style={{ marginBottom: "10px" }}>
            <label>
              Nom d'utilisateur:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{ width: "100%" }}
              />
            </label>
          </div>
        )}

        {userType === "commercant" && (
          <>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Nom du commerce:
                <input
                  type="text"
                  name="commerce_name"
                  value={formData.commerce_name}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Adresse:
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
              </label>
            </div>
          </>
        )}

        <div style={{ marginBottom: "10px" }}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Mot de passe:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <button type="submit">Créer le compte</button>
      </form>
    </div>
  );
}
