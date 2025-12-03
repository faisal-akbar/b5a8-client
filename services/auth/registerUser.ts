/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerValidationZodSchema } from "@/zod/auth.validation";
import { loginUser } from "./loginUser";


export const registerUser = async (_currentState: any, formData: any): Promise<any> => {
    try {
        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            role: formData.get('role') === 'guide' ? 'GUIDE' : 'TOURIST',
            bio: formData.get('bio') || undefined,
            languages: formData.get('languages') ? JSON.parse(formData.get('languages')) : undefined,
            expertise: formData.get('expertise') ? JSON.parse(formData.get('expertise')) : undefined,
            dailyRate: formData.get('dailyRate') ? parseInt(formData.get('dailyRate')) : undefined,
            travelPreferences: formData.get('travelPreferences') ? JSON.parse(formData.get('travelPreferences')) : undefined,
        }

        if (zodValidator(payload, registerValidationZodSchema).success === false) {
            return zodValidator(payload, registerValidationZodSchema);
        }

        const validatedPayload: any = zodValidator(payload, registerValidationZodSchema).data;
        
        const registerData = {
            name: validatedPayload.name,
            email: validatedPayload.email,
            password: validatedPayload.password,
            role: validatedPayload.role,
            ...(validatedPayload.bio && { bio: validatedPayload.bio }),
            ...(validatedPayload.languages && { languages: validatedPayload.languages }),
            ...(validatedPayload.expertise && { expertise: validatedPayload.expertise }),
            ...(validatedPayload.dailyRate && { dailyRate: validatedPayload.dailyRate }),
            ...(validatedPayload.travelPreferences && { travelPreferences: validatedPayload.travelPreferences }),
        }

        const newFormData = new FormData();

        newFormData.append("data", JSON.stringify(registerData));

        if (formData.get("file")) {
            newFormData.append("file", formData.get("file") as Blob);
        }

        const res = await serverFetch.post("/auth/register", {
            body: newFormData,
        })

        const result = await res.json();


        if (result.success) {
            // Auto-login after registration
            const loginFormData = new FormData();
            loginFormData.append('email', validatedPayload.email);
            loginFormData.append('password', validatedPayload.password);
            await loginUser(_currentState, loginFormData);
        }

        return result;



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
        
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? errorMessage : "Registration Failed. Please try again."}` };
    }
}

