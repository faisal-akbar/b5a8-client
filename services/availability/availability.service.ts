"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface GetAvailabilitiesParams {
  listingId?: string;
  page?: number;
  limit?: number;
}

export interface CreateAvailabilityParams {
  listingId: string;
  startDateTime: string; // ISO date string
  endDateTime: string; // ISO date string
  isAvailable: boolean;
}

export interface CreateBulkAvailabilityParams {
  listingId: string;
  availabilities: Array<{
    startDateTime: string;
    endDateTime: string;
    isAvailable: boolean;
  }>;
}

export interface UpdateAvailabilityParams {
  id: string;
  startDateTime?: string;
  endDateTime?: string;
  isAvailable?: boolean;
}

/**
 * Get all availabilities
 */
export async function getAvailabilities(params: GetAvailabilitiesParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.listingId) queryParams.append("listingId", params.listingId);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    
    const response = await serverFetch.get(`/availabilities?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get availabilities");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get availabilities",
    };
  }
}

/**
 * Get availability by ID
 */
export async function getAvailabilityById(id: string) {
  try {
    const response = await serverFetch.get(`/availabilities/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get availability");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get availability",
    };
  }
}

/**
 * Get my availabilities (Guide only)
 */
export async function getMyAvailabilities({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await serverFetch.get(`/availabilities/my/availabilities?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get my availabilities");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get my availabilities",
    };
  }
}

/**
 * Create availability (Guide only)
 */
export async function createAvailability(params: CreateAvailabilityParams) {
  try {
    const response = await serverFetch.post("/availabilities", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create availability");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to create availability",
    };
  }
}

/**
 * Create bulk availability (Guide only)
 */
export async function createBulkAvailability(params: CreateBulkAvailabilityParams) {
  try {
    const response = await serverFetch.post("/availabilities/bulk", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create bulk availability");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to create bulk availability",
    };
  }
}

/**
 * Update availability (Guide only)
 */
export async function updateAvailability({ id, ...params }: UpdateAvailabilityParams) {
  try {
    const response = await serverFetch.patch(`/availabilities/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update availability");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update availability",
    };
  }
}

/**
 * Delete availability (Guide only)
 */
export async function deleteAvailability(id: string) {
  try {
    const response = await serverFetch.delete(`/availabilities/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete availability");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete availability",
    };
  }
}

