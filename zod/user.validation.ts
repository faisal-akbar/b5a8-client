import { z } from "zod"

// Base schema for common profile fields
const updateProfileBaseZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  bio: z
    .string({ message: "Bio must be string" })
    .max(500, { message: "Bio cannot exceed 500 characters." })
    .optional(),
  languages: z
    .array(z.string(), { message: "Languages must be an array of strings" })
    .optional(),
})

// Admin Profile Edit Schema
export const updateAdminProfileZodSchema = updateProfileBaseZodSchema

// Guide Profile Edit Schema
export const updateGuideProfileZodSchema = updateProfileBaseZodSchema.extend({
  expertise: z
    .array(z.string(), { message: "Expertise must be an array of strings" })
    .optional(),
  dailyRate: z
    .number({ message: "Daily rate must be a number" })
    .int({ message: "Daily rate must be an integer." })
    .positive({ message: "Daily rate must be a positive number." })
    .optional(),
})

// Tourist Profile Edit Schema
export const updateTouristProfileZodSchema = updateProfileBaseZodSchema.extend({
  travelPreferences: z
    .array(z.string(), {
      message: "Travel preferences must be an array of strings",
    })
    .optional(),
})

// Generic update schema (for backward compatibility)
export const updateUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  bio: z
    .string({ message: "Bio must be string" })
    .max(500, { message: "Bio cannot exceed 500 characters." })
    .optional(),
  languages: z
    .array(z.string(), { message: "Languages must be an array of strings" })
    .optional(),
  // Guide specific update fields
  expertise: z
    .array(z.string(), { message: "Expertise must be an array of strings" })
    .optional(),
  dailyRate: z
    .number({ message: "Daily rate must be a number" })
    .int({ message: "Daily rate must be an integer." })
    .positive({ message: "Daily rate must be a positive number." })
    .optional(),
  // Tourist specific update fields
  travelPreferences: z
    .array(z.string(), {
      message: "Travel preferences must be an array of strings",
    })
    .optional(),
})

// Create Admin Schema
export const createAdminZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string({ message: "Email must be string" })
    .email("Invalid email address format.")
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: z
    .string({ message: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
  languages: z.array(z.string()).optional(),
})
