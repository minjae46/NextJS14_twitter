"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const passwordRegex = new RegExp(/^(?=.*\d).+$/);

const formSchema = z
  .object({
    username: z
      .string()
      .min(5, "Username should be at least 5 characters long.")
      .toLowerCase()
      .trim(),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        (email) => email.includes("zod.com"),
        "Only @zod.com emails are allowed."
      ),
    password: z
      .string()
      .min(10, "Password should be at least 10 characters long.")
      .regex(
        passwordRegex,
        "Password should contain at least one number (0123456789)."
      ),
    confirmPassword: z.string().min(10),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Both passwords should be equal.",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  console.log(data);
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    redirect("/log-in");
  }
}
