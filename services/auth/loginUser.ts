/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/auth-utils";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { loginValidationZodSchema } from "@/zod/auth.validation";
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { setCookie } from "./tokenHandlers";



export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
    try {
        const redirectTo = formData.get('redirect') || null;
        let accessTokenObject: null | any = null;
        let refreshTokenObject: null | any = null;
        const payload = {
            email: formData.get('email'),
            password: formData.get('password'),
        }

        if (zodValidator(payload, loginValidationZodSchema).success === false) {
            return zodValidator(payload, loginValidationZodSchema);
        }

        const validatedPayload = zodValidator(payload, loginValidationZodSchema).data;

        const res = await serverFetch.post("/auth/login", {
            body: JSON.stringify(validatedPayload),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await res.json();

        // Check if login was successful BEFORE trying to parse cookies
        // When login fails, backend returns error response without Set-Cookie headers
        if (!result.success) {
            // Backend returns errorMessages array in error response
            const errorMessages = result.errorMessages || [];
            // Convert errorMessages to errors format expected by form
            const errors = errorMessages.length > 0 
                ? errorMessages.map((err: { path?: string; message: string }) => ({
                    field: err.path || "password",
                    message: err.message
                }))
                : [{ field: "password", message: result.message || "Invalid email or password" }];
            
            return {
                success: false,
                message: result.message || "Login failed. Please check your credentials.",
                errors
            };
        }

        // Only parse cookies if login was successful
        const setCookieHeaders = res.headers.getSetCookie();

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie: string) => {
                const parsedCookie = parse(cookie);

                if (parsedCookie['accessToken']) {
                    accessTokenObject = parsedCookie;
                }
                if (parsedCookie['refreshToken']) {
                    refreshTokenObject = parsedCookie;
                }
            })
        } else {
            throw new Error("No Set-Cookie header found");
        }

        if (!accessTokenObject) {
            throw new Error("Tokens not found in cookies");
        }

        if (!refreshTokenObject) {
            throw new Error("Tokens not found in cookies");
        }


        await setCookie("accessToken", accessTokenObject.accessToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(accessTokenObject['Max-Age']) || 1000 * 60 * 60,
            path: accessTokenObject.Path || "/",
            sameSite: accessTokenObject['SameSite'] || "none",
        });

        await setCookie("refreshToken", refreshTokenObject.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObject['Max-Age']) || 1000 * 60 * 60 * 24 * 90,
            path: refreshTokenObject.Path || "/",
            sameSite: refreshTokenObject['SameSite'] || "none",
        });
        
        // Check if JWT_ACCESS_SECRET is configured
        if (!process.env.JWT_ACCESS_SECRET) {
            throw new Error("JWT_ACCESS_SECRET environment variable is not set. Please add it to your .env.local file.");
        }
        
        const verifiedToken: JwtPayload | string = jwt.verify(accessTokenObject.accessToken, process.env.JWT_ACCESS_SECRET);

        if (typeof verifiedToken === "string") {
            throw new Error("Invalid token");

        }

        const userRole: UserRole = verifiedToken.role as UserRole;

        if (redirectTo && result.data.needPasswordChange) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(`/reset-password?redirect=${requestedPath}`);
            } else {
                redirect("/reset-password");
            }
        }

        if (result.data.needPasswordChange) {
            redirect("/reset-password");
        }



        if (redirectTo) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(`${requestedPath}?loggedIn=true`);
            } else {
                redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
            }
        } else {
            redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
        }

    } catch (error: any) {
        // Re-throw NEXT_REDIRECT errors so Next.js can handle them
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.log(error);
        
        // Provide user-friendly error message for connection errors
        const errorMessage = error?.message || '';
        const isConnectionError = 
            error?.code === 'ECONNREFUSED' ||
            errorMessage.includes('Cannot connect to backend server') ||
            errorMessage.includes('fetch failed') ||
            errorMessage.includes('ECONNREFUSED') ||
            error?.cause?.code === 'ECONNREFUSED';
        
        if (isConnectionError) {
            return { 
                success: false, 
                message: "Backend server is not running. Please start the backend server first.",
                errors: [{ field: "server", message: "Backend server connection failed" }]
            };
        }
        
        // Check for JWT_ACCESS_SECRET missing error
        if (errorMessage.includes('secret or public key must be provided') || errorMessage.includes('JWT_ACCESS_SECRET')) {
            return { 
                success: false, 
                message: "JWT_ACCESS_SECRET is not configured. Please add JWT_ACCESS_SECRET to your .env.local file. It must match the backend's JWT_ACCESS_SECRET.",
                errors: [{ field: "config", message: "JWT_ACCESS_SECRET environment variable is missing" }]
            };
        }
        
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? errorMessage : "Login Failed. You might have entered incorrect email or password."}` };
    }
}

