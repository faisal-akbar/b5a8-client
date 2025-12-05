import { z } from "zod"
import type { Category } from "@/types/profile"

// Category enum values matching backend
const categoryEnum = [
  "CULTURE",
  "HISTORY",
  "FOOD",
  "ADVENTURE",
  "NATURE",
  "ART",
  "ARCHITECTURE",
  "BEACH",
  "WILDLIFE",
  "SHOPPING",
  "NIGHTLIFE",
  "PHOTOGRAPHY",
  "MUSIC",
  "RELIGION",
  "SPORTS",
  "WELLNESS",
  "FAMILY",
  "HERITAGE",
  "WATER_SPORTS",
  "HIKING",
  "CYCLING",
  "MARKETS",
  "FESTIVALS",
  "LOCAL_LIFE",
  "HIDDEN_GEMS",
  "MUSEUM",
  "ENTERTAINMENT",
  "CULINARY",
  "SPIRITUAL",
  "ECO_TOURISM",
  "URBAN_EXPLORATION",
  "COUNTRYSIDE",
  "MOUNTAIN",
  "CAMPING",
  "DIVING",
  "SURFING",
  "FOOD_TOUR",
  "STREET_FOOD",
] as const

export const createListingZodSchema = z.object({
  title: z
    .string({ message: "Title must be string" })
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(200, { message: "Title cannot exceed 200 characters." }),
  description: z
    .string({ message: "Description must be string" })
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(2000, { message: "Description cannot exceed 2000 characters." }),
  itinerary: z
    .string({ message: "Itinerary must be string" })
    .min(1, { message: "Itinerary is required." })
    .max(5000, { message: "Itinerary cannot exceed 5000 characters." }),
  tourFee: z
    .number({ message: "Tour fee must be a number" })
    .int({ message: "Tour fee must be an integer." })
    .positive({ message: "Tour fee must be a positive number." }),
  durationDays: z
    .number({ message: "Duration must be a number" })
    .int({ message: "Duration must be an integer." })
    .positive({ message: "Duration must be a positive number." })
    .max(365, { message: "Duration cannot exceed 365 days." }),
  meetingPoint: z
    .string({ message: "Meeting point must be string" })
    .min(5, { message: "Meeting point must be at least 5 characters long." })
    .max(500, { message: "Meeting point cannot exceed 500 characters." }),
  maxGroupSize: z
    .number({ message: "Max group size must be a number" })
    .int({ message: "Max group size must be an integer." })
    .positive({ message: "Max group size must be a positive number." })
    .max(100, { message: "Max group size cannot exceed 100." }),
  city: z
    .string({ message: "City must be string" })
    .min(2, { message: "City must be at least 2 characters long." })
    .max(100, { message: "City cannot exceed 100 characters." }),
  category: z.enum(categoryEnum, {
    message: "Category must be a valid category",
  }),
  images: z
    .array(z.instanceof(File), { message: "Images must be an array of files" })
    .min(1, { message: "At least one image is required." })
    .max(10, { message: "Cannot exceed 10 images." }),
})

export const updateListingZodSchema = z.object({
  title: z
    .string({ message: "Title must be string" })
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(200, { message: "Title cannot exceed 200 characters." })
    .optional(),
  description: z
    .string({ message: "Description must be string" })
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(2000, { message: "Description cannot exceed 2000 characters." })
    .optional(),
  itinerary: z
    .string({ message: "Itinerary must be string" })
    .max(5000, { message: "Itinerary cannot exceed 5000 characters." })
    .optional(),
  tourFee: z
    .number({ message: "Tour fee must be a number" })
    .int({ message: "Tour fee must be an integer." })
    .positive({ message: "Tour fee must be a positive number." })
    .optional(),
  durationDays: z
    .number({ message: "Duration must be a number" })
    .int({ message: "Duration must be an integer." })
    .positive({ message: "Duration must be a positive number." })
    .max(365, { message: "Duration cannot exceed 365 days." })
    .optional(),
  meetingPoint: z
    .string({ message: "Meeting point must be string" })
    .min(5, { message: "Meeting point must be at least 5 characters long." })
    .max(500, { message: "Meeting point cannot exceed 500 characters." })
    .optional(),
  maxGroupSize: z
    .number({ message: "Max group size must be a number" })
    .int({ message: "Max group size must be an integer." })
    .positive({ message: "Max group size must be a positive number." })
    .max(100, { message: "Max group size cannot exceed 100." })
    .optional(),
  city: z
    .string({ message: "City must be string" })
    .min(2, { message: "City must be at least 2 characters long." })
    .max(100, { message: "City cannot exceed 100 characters." })
    .optional(),
  category: z.enum(categoryEnum, {
    message: "Category must be a valid category",
  }).optional(),
  images: z
    .array(z.string(), { message: "Images must be an array of URLs" })
    .min(1, { message: "At least one image is required." })
    .max(10, { message: "Cannot exceed 10 images." })
    .optional(),
})

