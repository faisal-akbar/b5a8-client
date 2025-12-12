/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, UserRole } from "@/lib/auth-utils";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerValidationZodSchema } from "@/zod/auth.validation";
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { setCookie } from "./tokenHandlers";

export const registerUser = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      role: formData.get("role") === "guide" ? "GUIDE" : "TOURIST",
      bio: formData.get("bio") || undefined,
      languages: formData.get("languages")
        ? JSON.parse(formData.get("languages"))
        : undefined,
      expertise: formData.get("expertise")
        ? JSON.parse(formData.get("expertise"))
        : undefined,
      dailyRate: formData.get("dailyRate")
        ? parseInt(formData.get("dailyRate"))
        : undefined,
      travelPreferences: formData.get("travelPreferences")
        ? JSON.parse(formData.get("travelPreferences"))
        : undefined,
    };

    const validationResult = zodValidator(payload, registerValidationZodSchema);
    if (!("data" in validationResult)) {
      return validationResult;
    }

    const validatedPayload: any = validationResult.data;

    const registerData = {
      name: validatedPayload.name,
      email: validatedPayload.email,
      password: validatedPayload.password,
      role: validatedPayload.role,
      ...(validatedPayload.bio && { bio: validatedPayload.bio }),
      ...(validatedPayload.languages && {
        languages: validatedPayload.languages,
      }),
      ...(validatedPayload.expertise && {
        expertise: validatedPayload.expertise,
      }),
      ...(validatedPayload.dailyRate && {
        dailyRate: validatedPayload.dailyRate,
      }),
      ...(validatedPayload.travelPreferences && {
        travelPreferences: validatedPayload.travelPreferences,
      }),
    };

    const newFormData = new FormData();

    newFormData.append("data", JSON.stringify(registerData));

    if (formData.get("file")) {
      newFormData.append("file", formData.get("file") as Blob);
    }

    const res = await serverFetch.post("/auth/register", {
      body: newFormData,
    });

    const result = await res.json();

    // Check if registration was successful
    if (!result.success) {
      return result;
    }

    // Auto-login after successful registration
    // Parse cookies from response headers (similar to login flow)
    const setCookieHeaders = res.headers.getSetCookie();
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);

        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie["refreshToken"]) {
          refreshTokenObject = parsedCookie;
        }
      });
    }

    // If tokens are present, set them and redirect to dashboard
    if (accessTokenObject && refreshTokenObject) {
      await setCookie("accessToken", accessTokenObject.accessToken, {
        secure: true,
        httpOnly: true,
        maxAge: parseInt(accessTokenObject["Max-Age"]) || 1000 * 60 * 60,
        path: accessTokenObject.Path || "/",
        sameSite: accessTokenObject["SameSite"] || "none",
      });

      await setCookie("refreshToken", refreshTokenObject.refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge:
          parseInt(refreshTokenObject["Max-Age"]) || 1000 * 60 * 60 * 24 * 90,
        path: refreshTokenObject.Path || "/",
        sameSite: refreshTokenObject["SameSite"] || "none",
      });

      // Check if JWT_ACCESS_SECRET is configured
      if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error(
          "JWT_ACCESS_SECRET environment variable is not set. Please add it to your .env.local file."
        );
      }

      const verifiedToken: JwtPayload | string = jwt.verify(
        accessTokenObject.accessToken,
        process.env.JWT_ACCESS_SECRET
      );

      if (typeof verifiedToken === "string") {
        throw new Error("Invalid token");
      }

      const userRole: UserRole = verifiedToken.role as UserRole;

      // Redirect to appropriate dashboard with loggedIn parameter
      // This will trigger the navbar to refresh the auth state
      redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
    }

    // If no tokens, return success (fallback - should not happen if backend is correct)
    return {
      success: true,
      message: result.message || "Registration successful",
      data: {
        email: validatedPayload.email,
        name: validatedPayload.name,
        ...result.data,
      },
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.log(error);

    // Provide user-friendly error message for connection errors
    const errorMessage = error?.message || "";
    const isConnectionError =
      error?.code === "ECONNREFUSED" ||
      errorMessage.includes("Cannot connect to backend server") ||
      errorMessage.includes("fetch failed") ||
      errorMessage.includes("ECONNREFUSED") ||
      error?.cause?.code === "ECONNREFUSED";

    if (isConnectionError) {
      return {
        success: false,
        message:
          "Backend server is not running. Please start the backend server first.",
        errors: [
          { field: "server", message: "Backend server connection failed" },
        ],
      };
    }

    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Registration Failed. Please try again."
      }`,
    };
  }
};
