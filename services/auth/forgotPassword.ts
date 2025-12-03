"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
});

export interface ForgotPasswordParams {
  email: string;
}

/**
 * Forgot password - send reset email
 */
export async function forgotPassword({ email }: ForgotPasswordParams) {
  try {
    const payload = { email };
    
    const validation = zodValidator(payload, forgotPasswordSchema);
    if (!validation.success) {
      return validation;
    }

    const response = await serverFetch.post("/auth/forgot-password", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset email");
    }

    return {
      success: true,
      message: data.message || "Password reset email sent successfully",
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to send reset email",
    };
  }
}

