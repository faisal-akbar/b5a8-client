/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import jwt from "jsonwebtoken";

export const verifyAccessToken = async (token: string) => {
    try {
        if (!process.env.JWT_ACCESS_SECRET) {
            throw new Error("JWT_ACCESS_SECRET environment variable is not set. Please add it to your .env.local file.");
        }
        
        const verifiedAccessToken = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        ) as jwt.JwtPayload;

        return {
            success: true,
            message: "Token is valid",
            payload: verifiedAccessToken,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Invalid token",
        };
    }
};

