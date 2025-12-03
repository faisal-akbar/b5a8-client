/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";

export const registerValidationZodSchema = z
    .object({
        name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
        email: z.string().email({ message: "Valid email is required" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long." })
            .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter." })
            .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character." })
            .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." }),
        confirmPassword: z.string().min(8, { message: "Confirm Password is required." }),
        role: z.enum(["TOURIST", "GUIDE"], { message: "Role must be either TOURIST or GUIDE" }),
        bio: z.string().max(500, { message: "Bio cannot exceed 500 characters." }).optional(),
        languages: z.array(z.string()).min(1, { message: "At least one language must be specified." }).optional(),
        expertise: z.array(z.string()).optional(),
        dailyRate: z.number().int().positive().optional(),
        travelPreferences: z.array(z.string()).optional(),
    })
    .refine((data: any) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine(
        (data) => {
            // If role is GUIDE, dailyRate is required
            if (data.role === "GUIDE" && !data.dailyRate) {
                return false;
            }
            return true;
        },
        {
            message: "Daily rate is required for guides",
            path: ["dailyRate"],
        }
    );

export const loginValidationZodSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter." })
            .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character." })
            .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." }),
        confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

