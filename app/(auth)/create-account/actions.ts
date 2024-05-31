"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

const passwordRegex = new RegExp(/^(?=.*\d).+$/);

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username should be at least 2 characters long.")
      .toLowerCase()
      .trim(),
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
    confirmPassword: z
      .string()
      .min(6, "Password should be at least 6 characters long."),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "There is an account already registered with that email.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
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
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
    });
    redirect("/log-in");
  }
}
