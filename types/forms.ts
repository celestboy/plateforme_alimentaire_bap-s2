import { RegisterParticulierSchema } from "@/app/schema";
import { RegisterCommercantSchema } from "@/app/schema";
import { LoginSchema } from "@/app/schema";
import { DonSchema } from "@/app/schema";
import { ValidateSchema } from "@/app/schema";
import { z, ZodIssue } from "zod";

export type RegisterParticulierSchemaType = z.infer<
  typeof RegisterParticulierSchema
>;
export type RegisterCommercantSchemaType = z.infer<
  typeof RegisterCommercantSchema
>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type DonSchemaType = z.infer<typeof DonSchema>;
export type ValidateSchemaType = z.infer<typeof ValidateSchema>;
export type FormResponse = {
  success: boolean;
  errors?: ZodIssue[];
  message?: string;
  token?: string;
};
