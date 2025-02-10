// app/api/publish/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      measure_type,
      measure_value,
      expiration_date,
      meeting_points,
      photo,
    } = body;

    // Vérification des champs obligatoires
    if (
      !title ||
      !description ||
      !category ||
      !measure_type ||
      !measure_value ||
      !expiration_date ||
      !meeting_points ||
      !photo
    ) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Connexion à la base de données (assurez-vous que les variables d'environnement sont configurées)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Insertion de l'annonce (la colonne publication_date est gérée automatiquement par MySQL)
    const query = `INSERT INTO annonce (title, description, category, measure_type, measure_value, expiration_date, meeting_points, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      title,
      description,
      category,
      measure_type,
      measure_value,
      expiration_date,
      meeting_points,
      photo,
    ];

    const [result] = await connection.execute(query, values);
    await connection.end();

    return NextResponse.json({
      success: true,
      annonceId: (result as any).insertId,
    });
  } catch (error) {
    console.error("Erreur dans l’API publish:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
