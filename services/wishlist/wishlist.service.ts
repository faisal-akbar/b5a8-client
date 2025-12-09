"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface AddToWishlistParams {
  listingId: string;
}

export interface GetMyWishlistParams {
  page?: number;
  limit?: number;
}

/**
 * Add to wishlist (Tourist only)
 */
export async function addToWishlist({ listingId }: AddToWishlistParams) {
  try {
    const response = await serverFetch.post("/wishlist", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listingId }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to add to wishlist");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to add to wishlist",
    };
  }
}

/**
 * Get my wishlist (Tourist only)
 */
export async function getMyWishlist(params: GetMyWishlistParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    
    const response = await serverFetch.get(`/wishlist?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get wishlist");
    }
    
    // API returns: { success, message, data: [...], meta: {...} }
    // Return in the expected format: { success: true, data: { data: [...], meta: {...} } }
    return {
      success: true,
      data: {
        data: data.data || [],
        meta: data.meta || { total: 0, page: 1, limit: 10, totalPages: 0 },
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get wishlist",
    };
  }
}

/**
 * Check wishlist status (Tourist only)
 */
export async function checkWishlistStatus(listingId: string) {
  try {
    const response = await serverFetch.get(`/wishlist/check/${listingId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to check wishlist status");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to check wishlist status",
    };
  }
}

/**
 * Remove from wishlist (Tourist only)
 */
export async function removeFromWishlist(listingId: string) {
  try {
    const response = await serverFetch.delete(`/wishlist/${listingId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to remove from wishlist");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to remove from wishlist",
    };
  }
}


