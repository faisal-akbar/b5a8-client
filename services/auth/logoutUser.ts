/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import { redirect } from "next/navigation";
import { deleteCookie } from "./tokenHandlers";

export const logoutUser = async (): Promise<any> => {
    try {
        await serverFetch.post("/auth/logout", {});

        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");

        redirect("/login");
    } catch (error: any) {
        // Re-throw NEXT_REDIRECT errors so Next.js can handle them
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.log(error);
        // Even if logout fails, clear cookies and redirect
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");
        redirect("/login");
    }
}

