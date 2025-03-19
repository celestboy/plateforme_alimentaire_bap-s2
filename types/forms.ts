import {
  CreateChatSchema,
  RegisterParticulierSchema,
  RegisterCommercantSchema,
  LoginSchema,
  DonSchema,
  ValidateSchema,
  MessageSchema,
} from "@/app/schema";

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
export type CreateChatSchemaType = z.infer<typeof CreateChatSchema>;
export type MessageSchemaType = z.infer<typeof MessageSchema>;
export type FormResponse = {
  success: boolean;
  errors?: ZodIssue[];
  message?: string;
  token?: string;
};
