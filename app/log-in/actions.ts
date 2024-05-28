"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const passwordRegex = new RegExp(/^(?=.*\d).+$/);

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username should be at least 2 characters long.")
    .toLowerCase(),
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(
      (email) => email.includes("google.com"),
      "Only @google.com emails are allowed."
    ),
  password: z
    .string()
    .min(6, "Password should be at least 6 characters long.")
    .regex(
      passwordRegex,
      "Password should contain at least one number (0123456789)."
    ),
});

export async function logIn(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    redirect("/profile");
  }
}
