import { z } from "zod"

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


