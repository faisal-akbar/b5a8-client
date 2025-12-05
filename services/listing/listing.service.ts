"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface GetAllListingsParams {
  page?: number;
  limit?: number;
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
}

export interface CreateListingParams {
  title: string;
  description: string;
  itinerary: string;
  tourFee: number;
  durationDays: number;
  meetingPoint: string;
  maxGroupSize: number;
  city: string;
  category: string;
  images?: File[];
}

export interface UpdateListingParams {
  id: string;
  title?: string;
  description?: string;
  itinerary?: string;
  tourFee?: number;
  durationDays?: number;
  meetingPoint?: string;
  maxGroupSize?: number;
  city?: string;
  category?: string;
  images?: string[];
}

/**
 * Get all listings with filters
 */
export async function getAllListings(params: GetAllListingsParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.city) queryParams.append("city", params.city);
    if (params.category) queryParams.append("category", params.category);
    if (params.minPrice) queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.language) queryParams.append("language", params.language);
    
    const response = await serverFetch.get(`/listings?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get listings");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get listings",
    };
  }
}

/**
 * Get listing by ID
 */
export async function getListingById(id: string) {
  try {
    const response = await serverFetch.get(`/listings/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get listing");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get listing",
    };
  }
}

/**
 * Get featured cities
 */
export async function getFeaturedCities() {
  try {
    const response = await serverFetch.get("/listings/featured-cities");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get featured cities");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get featured cities",
    };
  }
}

/**
 * Get my listings (Guide only)
 */
export async function getMyListings({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await serverFetch.get(`/listings/my/listings?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get my listings");
    }
    
    // Backend returns: { success: true, data: [...listings], meta: {...} }
    // So data.data is the array of listings, and data.meta is pagination info
    // Wrap it in the expected structure for consistency with other paginated responses
    return {
      success: true,
      data: {
        data: Array.isArray(data.data) ? data.data : (data.data || []),
        meta: data.meta || {},
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get my listings",
    };
  }
}

/**
 * Create listing (Guide only)
 */
export async function createListing(params: CreateListingParams) {
  try {
    const formData = new FormData();
    
    formData.append("title", params.title);
    formData.append("description", params.description);
    formData.append("itinerary", params.itinerary);
    formData.append("tourFee", params.tourFee.toString());
    formData.append("durationDays", params.durationDays.toString());
    formData.append("meetingPoint", params.meetingPoint);
    formData.append("maxGroupSize", params.maxGroupSize.toString());
    formData.append("city", params.city);
    formData.append("category", params.category);
    
    if (params.images && params.images.length > 0) {
      params.images.forEach((file) => {
        formData.append("files", file);
      });
    }
    
    const response = await serverFetch.post("/listings", {
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create listing");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to create listing",
    };
  }
}

/**
 * Update listing (Guide only)
 */
export async function updateListing({ id, ...params }: UpdateListingParams) {
  try {
    const response = await serverFetch.patch(`/listings/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update listing");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update listing",
    };
  }
}

/**
 * Delete listing (Guide only)
 */
export async function deleteListing(id: string) {
  try {
    const response = await serverFetch.delete(`/listings/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete listing");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete listing",
    };
  }
}


