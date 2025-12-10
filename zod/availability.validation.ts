import { z } from "zod"

export const createAvailabilityZodSchema = z
  .object({
    listingId: z
      .string({ message: "Listing ID must be string" })
      .min(1, { message: "Listing ID is required." }),
    startDateTime: z
      .string({ message: "Start date time must be string" })
      .min(1, { message: "Start date time is required." }),
    endDateTime: z
      .string({ message: "End date time must be string" })
      .min(1, { message: "End date time is required." }),
    isAvailable: z
      .boolean({ message: "isAvailable must be true or false" })
      .optional()
      .default(true),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDateTime)
      const end = new Date(data.endDateTime)
      return end > start
    },
    {
      message: "End date time must be after start date time",
      path: ["endDateTime"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDateTime)
      const now = new Date()
      return start >= now
    },
    {
      message: "Start date time must be in the future",
      path: ["startDateTime"],
    }
  )

export const updateAvailabilityZodSchema = z
  .object({
    startDateTime: z
      .string({ message: "Start date time must be string" })
      .optional(),
    endDateTime: z
      .string({ message: "End date time must be string" })
      .optional(),
    isAvailable: z
      .boolean({ message: "isAvailable must be true or false" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDateTime && data.endDateTime) {
        const start = new Date(data.startDateTime)
        const end = new Date(data.endDateTime)
        return end > start
      }
      return true
    },
    {
      message: "End date time must be after start date time",
      path: ["endDateTime"],
    }
  )






