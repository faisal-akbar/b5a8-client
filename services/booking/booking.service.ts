"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface CreateBookingParams {
  listingId: string;
  date: string; // ISO date string
}

export interface GetMyBookingsParams {
  page?: number;
  limit?: number;
  type?: "upcoming" | "past";
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

export interface GetAllBookingsParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

export interface UpdateBookingStatusParams {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

/**
 * Create booking (Tourist only)
 */
export async function createBooking({ listingId, date }: CreateBookingParams) {
  try {
    const response = await serverFetch.post("/bookings", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId,
        date,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create booking");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to create booking",
    };
  }
}

/**
 * Get my bookings (Tourist or Guide)
 */
export async function getMyBookings(params: GetMyBookingsParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.type) queryParams.append("type", params.type);
    if (params.status) queryParams.append("status", params.status);
    
    const response = await serverFetch.get(`/bookings/my-bookings?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get bookings");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get bookings",
    };
  }
}

/**
 * Get all bookings (Admin only)
 */
export async function getAllBookings(params: GetAllBookingsParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.status) queryParams.append("status", params.status);
    
    const response = await serverFetch.get(`/bookings?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get bookings");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get bookings",
    };
  }
}

/**
 * Get booking by ID
 */
export async function getBookingById(id: string) {
  try {
    const response = await serverFetch.get(`/bookings/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get booking");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get booking",
    };
  }
}

/**
 * Update booking status (Guide or Admin)
 */
export async function updateBookingStatus({ id, status }: UpdateBookingStatusParams) {
  try {
    const response = await serverFetch.patch(`/bookings/${id}/status`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update booking status");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update booking status",
    };
  }
}

