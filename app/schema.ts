import { z } from "zod";

export const RegisterParticulierSchema = z.object({
  user_type: z.string().nonempty(),
  username: z
    .string()
    .min(3, { message: "Le pseudo doit contenir au moins 3 caractères." })
    .max(20, { message: "Le pseudo doit contenir au maximum 20 caractères." })
    .nonempty(),
  email: z.string().email({ message: "Le mail doit être valide." }).nonempty(),
  password: z
    .string()
    .min(6, {
      message: "Le mot de passe doit contenir au minimum 6 caractères.",
    })
    .max(25, {
      message: "Le mot de passe doit contenir au maximum 25 caractères.",
    })
    .nonempty(),
});
export const RegisterCommercantSchema = z.object({
  user_type: z.string().nonempty(),
  commerce_name: z
    .string()
    .min(5, {
      message: "Le nom du commerce doit contenir au moins 5 caractères.",
    })
    .max(100, { message: "Le pseudo doit contenir au maximum 100 caractères." })
    .nonempty(),
  adresse_commerce: z
    .string()
    .min(5, {
      message: "L'adresse du commerce doit contenir au moins 5 caractères.",
    })
    .max(100, {
      message: "L'adresse du commerce doit contenir au maximum 100 caractères.",
    })
    .nonempty(),
  email: z.string().email({ message: "Le mail doit être valide." }).nonempty(),
  password: z
    .string()
    .min(6, {
      message: "Le mot de passe doit contenir au minimum 6 caractères.",
    })
    .max(25, {
      message: "Le mot de passe doit contenir au maximum 25 caractères.",
    })
    .nonempty(),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Le mail doit être valide." }).nonempty(),
  password: z
    .string()
    .min(6, { message: "Le mot de passe fait au minimum 6 caractères." })
    .max(25, { message: "Le mot de passe ne peut pas excéder 25 caratères." })
    .nonempty(),
});

export const DonSchema = z.object({
  title: z.string().nonempty(),
  description: z
    .string()
    .max(500, {
      message: "La description du produit ne doit pas excéder 500 caratères.",
    })
    .nonempty(),
  category: z.enum(
    [
      "produits-frais",
      "produits-secs",
      "conserves",
      "produits-surgeles",
      "produits-boulangerie",
      "boissons",
      "autres",
    ],
    {
      message:
        "Veuillez choisir une des catégories de produits. Si vous ne savez pas quoi mettre, choissisez Autres.",
    }
  ),
  quantity: z
    .number()
    .min(1, { message: "La quantité doit être égale à 1 au minimum." })
    .max(1000, { message: "La quantité ne doit pas excéder 1000." })
    .nonnegative({ message: "La quantité ne peut pas être négative." }),
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
  rdv_pts: z.array(z.string().nonempty()),
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

export const CreateChatSchema = z.object({
  donneur_id: z.number(),
  receveur_id: z.number(),
  don_id: z.number(),
});

export const MessageSchema = z.object({
  content: z.string().nonempty(),
  author_id: z.number(),
  receiver_id: z.number(),
  chat_id: z.number(),
});
