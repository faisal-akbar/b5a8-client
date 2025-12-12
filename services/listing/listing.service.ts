"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface GetAllListingsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  isActive?: boolean;
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
  newImages?: File[];
  isActive?: boolean;
}

/**
 * Get all listings with filters
 */
export async function getAllListings(params: GetAllListingsParams = {}) {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params.city) queryParams.append("city", params.city);
    if (params.category) queryParams.append("category", params.category);
    if (params.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.language) queryParams.append("language", params.language);
    if (params.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());

    const response = await serverFetch.get(`/listings?${queryParams}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get listings");
    }

    // Backend returns: { success: true, data: [...listings], meta: {...} }
    // Wrap it in the expected structure
    return {
      success: true,
      data: {
        data: Array.isArray(result.data) ? result.data : [],
        meta: result.meta || { page: 1, limit: 12, total: 0, totalPages: 0 },
      },
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
 * Retrieves distinct categories
 */
export async function getDistinctCategories() {
  try {
    const response = await serverFetch.get("/listings/distinct-categories");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get distinct categories");
    }
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get distinct categories",
    };
  }
}

/**
 * Get my listings (Guide only)
 */
export async function getMyListings({
  page = 1,
  limit = 10,
}: { page?: number; limit?: number } = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await serverFetch.get(
      `/listings/my/listings?${queryParams}`
    );
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
        data: Array.isArray(data.data) ? data.data : data.data || [],
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
export async function updateListing({
  id,
  newImages,
  ...params
}: UpdateListingParams) {
  try {
    // If there are new image files, use FormData (like createListing)
    if (newImages && newImages.length > 0) {
      const formData = new FormData();

      // Append all text fields
      if (params.title) formData.append("title", params.title);
      if (params.description)
        formData.append("description", params.description);
      if (params.itinerary) formData.append("itinerary", params.itinerary);
      if (params.tourFee !== undefined)
        formData.append("tourFee", params.tourFee.toString());
      if (params.durationDays !== undefined)
        formData.append("durationDays", params.durationDays.toString());
      if (params.meetingPoint)
        formData.append("meetingPoint", params.meetingPoint);
      if (params.maxGroupSize !== undefined)
        formData.append("maxGroupSize", params.maxGroupSize.toString());
      if (params.city) formData.append("city", params.city);
      if (params.category) formData.append("category", params.category);
      if (params.isActive !== undefined)
        formData.append("isActive", params.isActive.toString());

      // Append existing image URLs as JSON string
      if (params.images && params.images.length > 0) {
        formData.append("existingImages", JSON.stringify(params.images));
      }

      // Append new image files
      newImages.forEach((file) => {
        formData.append("files", file);
      });

      const response = await serverFetch.patch(`/listings/${id}`, {
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update listing");
      }

      return {
        success: true,
        data: data.data,
      };
    } else {
      // No new files, use JSON (existing behavior)
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
    }
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
    console.log("response", response);
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
