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
    let userInfo: UserInfo | any;
    try {

        const response = await serverFetch.get("/auth/me", {
            cache: "force-cache",
            next: { tags: ["user-info"] }
        })

        const result = await response.json();

        if (result.success) {
            const accessToken = await getCookie("accessToken");

            if (!accessToken) {
                throw new Error("No access token found");
            }

            if (!process.env.JWT_ACCESS_SECRET) {
                throw new Error("JWT_ACCESS_SECRET environment variable is not set");
            }

            const verifiedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) as JwtPayload;

            userInfo = {
                name: verifiedToken.name || "Unknown User",
                email: verifiedToken.email,
                role: verifiedToken.role,
            }
        }

        userInfo = {
            name: result.data?.name || "Unknown User",
            ...result.data
        };

        return userInfo;
    } catch (error: any) {
        console.log(error);
        // Return null role to indicate user is not logged in
        return {
            id: "",
            name: "",
            email: "",
            role: null,
        };
    }
}

