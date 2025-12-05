"use server";

import { serverFetch } from "@/lib/server-fetch";

/**
 * Get overview stats (Admin only)
 */
export async function getOverviewStats() {
  try {
    const response = await serverFetch.get("/stats/overview");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get overview stats");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get overview stats",
    };
  }
}

/**
 * Get user stats (Admin only)
 */
export async function getUserStats() {
  try {
    const response = await serverFetch.get("/stats/users");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get user stats");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get user stats",
    };
  }
}

/**
 * Get tourist stats (Admin only)
 */
export async function getTouristStats() {
  try {
    const response = await serverFetch.get("/stats/tourists");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get tourist stats");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get tourist stats",
    };
  }
}

/**
 * Get guide stats (Admin only)
 */
export async function getGuideStats() {
  try {
    const response = await serverFetch.get("/stats/guides");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get guide stats");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get guide stats",
    };
  }
}

/**
 * Get listing stats (Admin only)
 */
export async function getListingStats() {
  try {
    const response = await serverFetch.get("/stats/listings");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get listing stats");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get listing stats",
    };
  }
}

/**
 * Get booking stats (Admin only)
 */
export async function getBookingStats() {
  try {
    const response = await serverFetch.get("/stats/bookings");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get booking stats");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get booking stats",
    };
  }
}

/**
 * Get revenue stats (Admin only)
 */
export async function getRevenueStats() {
  try {
    const response = await serverFetch.get("/stats/revenue");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get revenue stats");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get revenue stats",
    };
  }
}

/**
 * Get profit stats (Admin only)
 */
export async function getProfitStats() {
  try {
    const response = await serverFetch.get("/stats/profit");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get profit stats");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get profit stats",
    };
  }
}


