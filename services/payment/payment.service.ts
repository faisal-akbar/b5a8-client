"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface ConfirmPaymentParams {
  paymentIntentId: string;
}

export interface GetPaymentsParams {
  page?: number;
  limit?: number;
}

/**
 * Confirm payment (Tourist only)
 */
export async function confirmPayment({ paymentIntentId }: ConfirmPaymentParams) {
  try {
    const response = await serverFetch.post("/payments/confirm", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentIntentId }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to confirm payment");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to confirm payment",
    };
  }
}

/**
 * Get my payments
 */
export async function getPayments(params: GetPaymentsParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    
    const response = await serverFetch.get(`/payments?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get payments");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get payments",
    };
  }
}

/**
 * Get payment by booking ID
 */
export async function getPaymentByBookingId(bookingId: string) {
  try {
    const response = await serverFetch.get(`/payments/booking/${bookingId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get payment");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get payment",
    };
  }
}

/**
 * Get payment by ID
 */
export async function getPaymentById(id: string) {
  try {
    const response = await serverFetch.get(`/payments/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get payment");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get payment",
    };
  }
}

/**
 * Release payment to guide (Guide or Admin)
 */
export async function releasePaymentToGuide(id: string) {
  try {
    const response = await serverFetch.post(`/payments/${id}/release`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to release payment");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to release payment",
    };
  }
}

