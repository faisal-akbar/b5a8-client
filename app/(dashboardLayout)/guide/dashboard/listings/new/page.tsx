"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateTourPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const categories = [
    "Food & Dining",
    "History & Culture",
    "Photography",
    "Shopping",
    "Nightlife",
    "Adventure",
    "Local Life",
    "Art & Design",
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages([...uploadedImages, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <Card>
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-foreground">Create New Tour</h1>
              <p className="mt-2 text-muted-foreground">Share your unique experience with travelers</p>

              <form className="mt-8 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

                  <div className="space-y-2">
                    <Label htmlFor="title">Tour Title *</Label>
                    <Input id="title" placeholder="e.g., Hidden Jazz Bars of New Orleans" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your tour, what makes it special, and what travelers can expect..."
                      rows={6}
                      required
                    />
                  </div>
                </div>

                {/* Tour Details */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">Tour Details</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (hours) *</Label>
                      <Input id="duration" type="number" min="0.5" step="0.5" placeholder="3" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Person ($) *</Label>
                      <Input id="price" type="number" min="0" placeholder="85" required />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="groupSize">Max Group Size *</Label>
                      <Input id="groupSize" type="number" min="1" placeholder="8" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Primary Language *</Label>
                      <Select>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meetingPoint">Meeting Point *</Label>
                    <Input
                      id="meetingPoint"
                      placeholder="e.g., Jackson Square, in front of St. Louis Cathedral"
                      required
                    />
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
                      placeholder="Describe the main stops and activities during your tour..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">What's Included</h2>

                  <div className="space-y-2">
                    <Label htmlFor="included">Included Items</Label>
                    <Textarea id="included" placeholder="List what's included (one item per line)..." rows={4} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notIncluded">Not Included Items</Label>
                    <Textarea id="notIncluded" placeholder="List what's not included (one item per line)..." rows={4} />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">Photos</h2>
                  <p className="text-sm text-muted-foreground">Add at least 3 high-quality photos of your tour</p>

                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video overflow-hidden rounded-lg border-2 border-border"
                        >
                          <img
                            src={image || "/placeholder.svg"}
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

                      {uploadedImages.length < 10 && (
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
                  <Button type="submit" size="lg" className="flex-1 sm:flex-none">
                    Create Tour
                  </Button>
                  <Link href="/dashboard" className="flex-1 sm:flex-none">
                    <Button type="button" variant="outline" size="lg" className="w-full bg-transparent">
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
