/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./tokenHandlers";

export interface UserInfo {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    needPasswordChange?: boolean;
    [key: string]: any;
}

export const getUserInfo = async (): Promise<UserInfo | any> => {
    try {
        const accessToken = await getCookie("accessToken");

        if (!accessToken) {
            // No access token, user is not logged in
            return {
                id: "",
                name: "",
                email: "",
                role: null,
            };
        }

        if (!process.env.JWT_ACCESS_SECRET) {
            throw new Error("JWT_ACCESS_SECRET environment variable is not set");
        }

        // Verify token first
        const verifiedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) as JwtPayload;

        // If token is valid, try to get full user info from API
        const response = await serverFetch.get("/user/me", {
            cache: "no-store",
            next: { tags: ["user-info"], revalidate: 0 }
        })

        const result = await response.json();

        // If API call was successful, use API data, otherwise use token data
        if (result.success && result.data) {
            return {
                id: result.data.id || verifiedToken.id || "",
                name: result.data.name || verifiedToken.name || "Unknown User",
                email: result.data.email || verifiedToken.email || "",
                role: result.data.role || verifiedToken.role || null,
                ...result.data
            };
        }

        // Fallback to token data if API call failed but token is valid
        return {
            id: verifiedToken.id || "",
            name: verifiedToken.name || "Unknown User",
            email: verifiedToken.email || "",
            role: verifiedToken.role || null,
        };
    } catch (error: any) {
        // Token is invalid or expired, user is not logged in
        console.log("getUserInfo error:", error);
        return {
            id: "",
            name: "",
            email: "",
            role: null,
        };
    }
}

