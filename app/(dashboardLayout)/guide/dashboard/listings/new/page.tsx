"use client"

import type React from "react"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createListing } from "@/services/listing/listing.service"
import type { Category } from "@/types/profile"
import { createListingZodSchema } from "@/zod/listing.validation"
import { zodValidator } from "@/lib/zodValidator"
import InputFieldError from "@/components/shared/InputFieldError"
import type { IInputErrorState } from "@/lib/getInputFieldError"

const categories: { value: Category; label: string }[] = [
  { value: "CULTURE", label: "Culture" },
  { value: "HISTORY", label: "History" },
  { value: "FOOD", label: "Food" },
  { value: "ADVENTURE", label: "Adventure" },
  { value: "NATURE", label: "Nature" },
  { value: "ART", label: "Art" },
  { value: "ARCHITECTURE", label: "Architecture" },
  { value: "BEACH", label: "Beach" },
  { value: "WILDLIFE", label: "Wildlife" },
  { value: "SHOPPING", label: "Shopping" },
  { value: "NIGHTLIFE", label: "Nightlife" },
  { value: "PHOTOGRAPHY", label: "Photography" },
  { value: "MUSIC", label: "Music" },
  { value: "RELIGION", label: "Religion" },
  { value: "SPORTS", label: "Sports" },
  { value: "WELLNESS", label: "Wellness" },
  { value: "FAMILY", label: "Family" },
  { value: "HERITAGE", label: "Heritage" },
  { value: "WATER_SPORTS", label: "Water Sports" },
  { value: "HIKING", label: "Hiking" },
  { value: "CYCLING", label: "Cycling" },
  { value: "MARKETS", label: "Markets" },
  { value: "FESTIVALS", label: "Festivals" },
  { value: "LOCAL_LIFE", label: "Local Life" },
  { value: "HIDDEN_GEMS", label: "Hidden Gems" },
  { value: "MUSEUM", label: "Museum" },
  { value: "ENTERTAINMENT", label: "Entertainment" },
  { value: "CULINARY", label: "Culinary" },
  { value: "SPIRITUAL", label: "Spiritual" },
  { value: "ECO_TOURISM", label: "Eco Tourism" },
  { value: "URBAN_EXPLORATION", label: "Urban Exploration" },
  { value: "COUNTRYSIDE", label: "Countryside" },
  { value: "MOUNTAIN", label: "Mountain" },
  { value: "CAMPING", label: "Camping" },
  { value: "DIVING", label: "Diving" },
  { value: "SURFING", label: "Surfing" },
  { value: "FOOD_TOUR", label: "Food Tour" },
  { value: "STREET_FOOD", label: "Street Food" },
]

export default function CreateTourPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    itinerary: "",
    tourFee: "",
    durationDays: "",
    meetingPoint: "",
    maxGroupSize: "",
    city: "",
    category: "" as Category | "",
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<IInputErrorState | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: Category) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setImageFiles((prev) => [...prev, ...newFiles])
      
      // Create previews
      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors(null)

    // Prepare data for validation - Zod will validate all fields and return all errors
    const validationData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      itinerary: formData.itinerary.trim(),
      tourFee: formData.tourFee && formData.tourFee.trim() !== "" 
        ? Number.parseFloat(formData.tourFee) 
        : 0, // Pass 0 so Zod's positive check will catch it
      durationDays: formData.durationDays && formData.durationDays.trim() !== "" 
        ? Number.parseInt(formData.durationDays) 
        : 0, // Pass 0 so Zod's positive check will catch it
      meetingPoint: formData.meetingPoint.trim(),
      maxGroupSize: formData.maxGroupSize && formData.maxGroupSize.trim() !== "" 
        ? Number.parseInt(formData.maxGroupSize) 
        : 0, // Pass 0 so Zod's positive check will catch it
      city: formData.city.trim(),
      category: formData.category || ("" as Category), // Empty string will fail enum validation
      images: imageFiles,
    }

    // Zod validation - this will validate all fields including images
    const validation = zodValidator(validationData, createListingZodSchema)
    if (!validation.success) {
      setValidationErrors(validation)
      const errorCount = validation.errors?.length || 0
      const firstError = validation.errors?.[0]?.message || "Validation failed"
      if (errorCount === 1) {
        toast.error(firstError)
      } else {
        toast.error(`${errorCount} validation errors found. Please check the form fields.`)
      }
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createListing(validationData)

      if (result.success) {
        toast.success("Tour listing created successfully!")
        router.refresh() // Refresh server-side data
        router.push("/guide/dashboard?refresh=" + Date.now()) // Add timestamp to force client-side refresh
      } else {
        toast.error(result.message || "Failed to create listing")
      }
    } catch (error) {
      console.error("Error creating listing:", error)
      toast.error("An error occurred while creating the listing")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/guide/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <Card>
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-foreground">Create New Tour</h1>
              <p className="mt-2 text-muted-foreground">Share your unique experience with travelers</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                {/* Basic Info */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

                  <div className="space-y-2">
                    <Label htmlFor="title">Tour Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Hidden Jazz Bars of New Orleans"
                    />
                    <InputFieldError field="title" state={validationErrors} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InputFieldError field="category" state={validationErrors} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., New Orleans"
                    />
                    <InputFieldError field="city" state={validationErrors} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your tour, what makes it special, and what travelers can expect..."
                      rows={6}
                    />
                    <InputFieldError field="description" state={validationErrors} />
                  </div>
                </div>

                {/* Tour Details */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">Tour Details</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="durationDays">Duration (days) *</Label>
                      <Input
                        id="durationDays"
                        name="durationDays"
                        type="number"
                        min="1"
                        value={formData.durationDays}
                        onChange={handleInputChange}
                        placeholder="1"
                      />
                      <InputFieldError field="durationDays" state={validationErrors} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tourFee">Price per Person ($) *</Label>
                      <Input
                        id="tourFee"
                        name="tourFee"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.tourFee}
                        onChange={handleInputChange}
                        placeholder="85"
                      />
                      <InputFieldError field="tourFee" state={validationErrors} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="maxGroupSize">Max Group Size *</Label>
                      <Input
                        id="maxGroupSize"
                        name="maxGroupSize"
                        type="number"
                        min="1"
                        value={formData.maxGroupSize}
                        onChange={handleInputChange}
                        placeholder="8"
                      />
                      <InputFieldError field="maxGroupSize" state={validationErrors} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meetingPoint">Meeting Point *</Label>
                    <Input
                      id="meetingPoint"
                      name="meetingPoint"
                      value={formData.meetingPoint}
                      onChange={handleInputChange}
                      placeholder="e.g., Jackson Square, in front of St. Louis Cathedral"
                    />
                    <InputFieldError field="meetingPoint" state={validationErrors} />
                  </div>
                </div>

                {/* Itinerary */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">Itinerary</h2>
                  <p className="text-sm text-muted-foreground">Add the main stops or activities in your tour</p>

                  <div className="space-y-2">
                    <Label htmlFor="itinerary">Tour Itinerary *</Label>
                    <Textarea
                      id="itinerary"
                      name="itinerary"
                      value={formData.itinerary}
                      onChange={handleInputChange}
                      placeholder="Describe the main stops and activities during your tour..."
                      rows={4}
                    />
                    <InputFieldError field="itinerary" state={validationErrors} />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">Photos</h2>
                  <p className="text-sm text-muted-foreground">Add at least 1 high-quality photo of your tour</p>
                  <InputFieldError field="images" state={validationErrors} />

                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative aspect-video overflow-hidden rounded-lg border-2 border-border"
                        >
                          <img
                            src={preview}
                            alt={`Upload ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      {imageFiles.length < 10 && (
                        <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="mt-2 text-sm text-muted-foreground">Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 border-t border-border pt-6">
                  <Button type="submit" size="lg" className="flex-1 sm:flex-none" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Tour"
                    )}
                  </Button>
                  <Link href="/guide/dashboard" className="flex-1 sm:flex-none">
                    <Button type="button" variant="outline" size="lg" className="w-full bg-transparent" disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
