"use server";

import nodemailer from "nodemailer";
import { z } from "zod";
import { ContactSchema } from "@/app/schema";

export async function sendContactEmail(formData: FormData) {
  const rawFormData = {
    firstname: formData.get("firstname") as string,
    name: formData.get("name") as string,
    sujet: formData.get("sujet") as string,
    email: formData.get("email") as string,
    content: formData.get("content") as string,
  };

  console.log("Données reçues :", rawFormData);

  try {
    const validatedData = ContactSchema.parse(rawFormData);
    console.log("Données validées :", validatedData);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${validatedData.firstname} ${validatedData.name}" <${validatedData.email}>`,
      to: process.env.MY_EMAIL,
      subject: validatedData.sujet,
      text: validatedData.content,
      html: `
        <h2><strong>Sujet:</strong> ${validatedData.sujet}</h2>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Prénom:</strong> ${validatedData.firstname}</p>
        <p><strong>Nom:</strong> ${validatedData.name}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.content}</p>
      `,
    });

    return {
      success: true,
      message: "Email envoyé avec succès !",
    };
  } catch (error) {
    console.error("Erreur complète :", error);

    if (error instanceof z.ZodError) {
      console.error("Erreurs de validation Zod :", error.errors);
      return {
        success: false,
        errors: error.errors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
}
