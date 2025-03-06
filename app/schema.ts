import { z } from "zod";

export const RegisterSchema = z
  .object({
    user_type: z.enum(["particulier", "commercant"]),
    username: z.string().min(3).max(20).optional(),
    commerce_name: z.string().min(3).max(50).optional(),
    adresse_commerce: z.string().min(5).max(50).optional(),
    email: z.string().email().nonempty(),
    password: z.string().min(6).max(25).nonempty(),
  })
  .refine(
    (data) =>
      (data.user_type === "particulier" && data.username) ||
      (data.user_type === "commercant" &&
        data.commerce_name &&
        data.adresse_commerce),
    {
      message:
        "Si vous êtes un particulier, le nom d'utilisateur est requis. Si vous êtes commerçant, le nom et l'adresse du commerce sont requis.",
      path: ["user_type"],
    }
  );

export const LoginSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(6).max(25).nonempty(),
});

export const DonSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().max(200).nonempty(),
  category: z.string().nonempty(),
  quantity: z.number().min(0.1).max(1000),
  limit_date: z
    .string()
    .nonempty({ message: "La date limite est requise !" })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date > new Date();
      },
      {
        message: "L'heure doit être valide et dans le futur.",
      }
    ),
  rdv_pts: z.string().nonempty(),
});

export const ValidateSchema = z.object({
  lieu: z.string().nonempty(),
  heure: z
    .string()
    .nonempty({ message: "L'heure est requise." })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date > new Date();
      },
      {
        message: "L'heure doit être valide et dans le futur.",
      }
    ),
});
