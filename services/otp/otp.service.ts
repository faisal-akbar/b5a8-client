"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface SendOTPParams {
  email: string;
  name: string;
}

export interface VerifyOTPParams {
  email: string;
  otp: string;
}

/**
 * Send OTP
 */
export async function sendOTP({ email, name }: SendOTPParams) {
  try {
    const response = await serverFetch.post("/otp/send", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to send OTP",
    };
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP({ email, otp }: VerifyOTPParams) {
  try {
    const response = await serverFetch.post("/otp/verify", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to verify OTP");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to verify OTP",
    };
  }
}

