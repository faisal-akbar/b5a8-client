"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import z from "zod";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter." })
      .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character." })
      .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." }),
    confirmPassword: z.string().min(8, { message: "Confirm Password is required." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Change password - requires old password
 */
export async function changePassword({ oldPassword, newPassword, confirmPassword }: ChangePasswordParams) {
  try {
    const payload = { oldPassword, newPassword, confirmPassword };
    
    const validation = zodValidator(payload, changePasswordSchema);
    if (!validation.success) {
      return validation;
    }

    const response = await serverFetch.post("/auth/change-password", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to change password");
    }

    return {
      success: true,
      message: data.message || "Password changed successfully",
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to change password",
    };
  }
}

