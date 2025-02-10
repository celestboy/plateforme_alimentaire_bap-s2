// app/api/login/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Requête reçue:", body); // Ajoutez ce log pour voir ce qui est reçu

    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Rechercher l'utilisateur par email, username ou commerce_name
    const [rows] = await connection.execute(
      `SELECT * FROM user WHERE email = ? OR username = ? OR commerce_name = ?`,
      [identifier, identifier, identifier]
    );
    await connection.end();

    const users = rows as any[];
    if (users.length === 0) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Authentification réussie
    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Erreur dans l’API login:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
