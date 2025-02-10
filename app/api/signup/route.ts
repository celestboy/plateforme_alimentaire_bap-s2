// app/api/signup/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email, password, username, commerce_name, adresse } = body;

    // Vérification des champs obligatoires
    if (
      !type ||
      !email ||
      !password ||
      (type === "particulier" && !username) ||
      (type === "commercant" && (!commerce_name || !adresse))
    ) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Hashage du mot de passe avec bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    let query = "";
    let values: any[] = [];

    if (type === "particulier") {
      query = `INSERT INTO user (type, username, email, password) VALUES (?, ?, ?, ?)`;
      values = [type, username, email, hashedPassword];
    } else if (type === "commercant") {
      query = `INSERT INTO user (type, commerce_name, adresse, email, password) VALUES (?, ?, ?, ?, ?)`;
      values = [type, commerce_name, adresse, email, hashedPassword];
    }

    const [result] = await connection.execute(query, values);
    await connection.end();

    return NextResponse.json({
      success: true,
      userId: (result as any).insertId,
    });
  } catch (error) {
    console.error("Erreur dans l’API signup:", error);
    // Renvoi du message d'erreur dans la réponse (pour le debug, mais à éviter en production)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
