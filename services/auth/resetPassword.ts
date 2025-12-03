"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { resetPasswordSchema } from "@/zod/auth.validation";

export interface ResetPasswordParams {
  id: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Reset password - requires user ID and new password (used after forgot password flow)
 */
export async function resetPassword({ id, newPassword, confirmPassword }: ResetPasswordParams) {
  try {
    const payload = { newPassword, confirmPassword };
    
    const validation = zodValidator(payload, resetPasswordSchema);
    if (!validation.success) {
      return validation;
    }

    const response = await serverFetch.post("/auth/reset-password", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password");
    }

    return {
      success: true,
      message: data.message || "Password reset successfully",
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to reset password",
    };
  }
}

