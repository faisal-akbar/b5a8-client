"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface GetUserByIdParams {
  id: string;
}

export interface UpdateUserParams {
  id: string;
  name?: string;
  bio?: string;
  languages?: string[];
  travelPreferences?: string[];
  expertise?: string[];
  dailyRate?: number;
  profilePic?: File;
}

export interface CreateAdminParams {
  name: string;
  email: string;
  password: string;
  languages?: string[];
}

export interface BlockUserParams {
  id: string;
  isActive: "ACTIVE" | "BLOCKED";
}

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
}

/**
 * Get current user profile
 */
export async function getMyProfile() {
  try {
    const response = await serverFetch.get("/user/me");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get profile");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get profile",
    };
  }
}

/**
 * Get user by ID (public profile)
 */
export async function getUserById({ id }: GetUserByIdParams) {
  try {
    const response = await serverFetch.get(`/user/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get user");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get user",
    };
  }
}

/**
 * Get top rated guides
 */
export async function getTopRatedGuides() {
  try {
    const response = await serverFetch.get("/user/top-rated-guides");
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get top rated guides");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get top rated guides",
    };
  }
}

/**
 * Get all users (Admin only)
 */
export async function getAllUsers({ page = 1, limit = 10 }: GetAllUsersParams = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await serverFetch.get(`/user/all-users?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get users");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to get users",
    };
  }
}

/**
 * Update user profile
 */
export async function updateUser({ id, ...params }: UpdateUserParams) {
  try {
    const formData = new FormData();
    
    if (params.name) formData.append("name", params.name);
    if (params.bio !== undefined) formData.append("bio", params.bio || "");
    if (params.languages) formData.append("languages", JSON.stringify(params.languages));
    if (params.travelPreferences) formData.append("travelPreferences", JSON.stringify(params.travelPreferences));
    if (params.expertise) formData.append("expertise", JSON.stringify(params.expertise));
    if (params.dailyRate !== undefined) formData.append("dailyRate", params.dailyRate.toString());
    if (params.profilePic) formData.append("profilePic", params.profilePic);
    
    // For FormData, we need to let the browser set Content-Type with boundary
    // So we don't set it explicitly - the fetch API will handle it
    const response = await serverFetch.patch(`/user/${id}`, {
      body: formData,
      // Don't set Content-Type - fetch will set it automatically for FormData
    } as any);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update user");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update user",
    };
  }
}

/**
 * Block/Unblock user (Admin only)
 */
export async function blockUser({ id, isActive }: BlockUserParams) {
  try {
    const response = await serverFetch.patch(`/user/${id}/block-user`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to block user");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to block user",
    };
  }
}

/**
 * Create admin (Admin only)
 */
export async function createAdmin({ name, email, password, languages }: CreateAdminParams) {
  try {
    const response = await serverFetch.post("/user/create-admin", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        languages: languages || [],
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create admin");
    }
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to create admin",
    };
  }
}

