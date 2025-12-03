"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface GetReviewsParams {
  listingId?: string;
  page?: number;
  limit?: number;
}

export interface CreateReviewParams {
  guideId: string;
  listingId: string;
  rating: number; // 1-5
  comment: string;
}

export interface UpdateReviewParams {
  id: string;
  rating?: number;
  comment?: string;
}

/**
 * Get all reviews
 */
export async function getReviews(params: GetReviewsParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.listingId) queryParams.append("listingId", params.listingId);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    
    const response = await serverFetch.get(`/reviews?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get reviews");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get reviews",
    };
  }
}

/**
 * Get review by ID
 */
export async function getReviewById(id: string) {
  try {
    const response = await serverFetch.get(`/reviews/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get review");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get review",
    };
  }
}

/**
 * Create review (Tourist only)
 */
export async function createReview({ guideId, listingId, rating, comment }: CreateReviewParams) {
  try {
    const response = await serverFetch.post("/reviews", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guideId,
        listingId,
        rating,
        comment,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create review");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to create review",
    };
  }
}

/**
 * Update review (Tourist or Admin)
 */
export async function updateReview({ id, ...params }: UpdateReviewParams) {
  try {
    const response = await serverFetch.patch(`/reviews/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update review");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update review",
    };
  }
}

/**
 * Delete review (Tourist or Admin)
 */
export async function deleteReview(id: string) {
  try {
    const response = await serverFetch.delete(`/reviews/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete review");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete review",
    };
  }
}

