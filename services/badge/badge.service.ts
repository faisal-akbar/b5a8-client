"use server";

import { serverFetch } from "@/lib/server-fetch";

/**
 * Get guide badges (public)
 */
export async function getGuideBadges(guideId: string) {
  try {
    const response = await serverFetch.get(`/badges/guide/${guideId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get guide badges");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get guide badges",
    };
  }
}

/**
 * Recalculate guide badges (Admin only)
 */
export async function recalculateGuideBadges(guideId: string) {
  try {
    const response = await serverFetch.post(`/badges/guide/${guideId}/recalculate`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to recalculate guide badges");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to recalculate guide badges",
    };
  }
}

/**
 * Recalculate all badges (Admin only)
 */
export async function recalculateAllBadges() {
  try {
    const response = await serverFetch.post("/badges/recalculate-all", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to recalculate all badges");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to recalculate all badges",
    };
  }
}

