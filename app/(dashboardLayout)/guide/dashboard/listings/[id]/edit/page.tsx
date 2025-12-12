"use client";

import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { Footer } from "@/components/layout/footer";
import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { IInputErrorState } from "@/lib/getInputFieldError";
import { zodValidator } from "@/lib/zodValidator";
import {
  getListingById,
  updateListing,
} from "@/services/listing/listing.service";
import type { Category } from "@/types/profile";
import { updateListingZodSchema } from "@/zod/listing.validation";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  { value: "URBAN_EXPLORATION", label: "Urban Exploration" },
  { value: "COUNTRYSIDE", label: "Countryside" },
  { value: "MOUNTAIN", label: "Mountain" },
  { value: "CAMPING", label: "Camping" },
  { value: "DIVING", label: "Diving" },
  { value: "SURFING", label: "Surfing" },
  { value: "FOOD_TOUR", label: "Food Tour" },
  { value: "STREET_FOOD", label: "Street Food" },
];

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    isActive: true,
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] =
    useState<IInputErrorState | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const result = await getListingById(listingId);

        if (result.success && result.data) {
          const listing = result.data;
          setFormData({
            title: listing.title || "",
            description: listing.description || "",
            itinerary: listing.itinerary || "",
            tourFee: listing.tourFee?.toString() || "",
            durationDays: listing.durationDays?.toString() || "",
            meetingPoint: listing.meetingPoint || "",
            maxGroupSize: listing.maxGroupSize?.toString() || "",
            city: listing.city || "",
            category: listing.category || ("" as Category | ""),
            isActive: listing.isActive ?? true,
          });
          setExistingImages(listing.images || []);
        } else {
          toast.error("Failed to load listing");
          router.push("/guide/dashboard");
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("An error occurred while loading the listing");
        router.push("/guide/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: Category) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);

      // Create previews
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors(null);

    // Validate images
    const allImages = [...existingImages];
    if (allImages.length === 0) {
      setValidationErrors({
        success: false,
        errors: [
          { field: "images", message: "At least one image is required." },
        ],
      });
      return;
    }

    // Prepare data for validation
    const validationData = {
      title: formData.title || undefined,
      description: formData.description || undefined,
      itinerary: formData.itinerary || undefined,
      tourFee: formData.tourFee
        ? Number.parseFloat(formData.tourFee)
        : undefined,
      durationDays: formData.durationDays
        ? Number.parseInt(formData.durationDays)
        : undefined,
      meetingPoint: formData.meetingPoint || undefined,
      maxGroupSize: formData.maxGroupSize
        ? Number.parseInt(formData.maxGroupSize)
        : undefined,
      city: formData.city || undefined,
      category: formData.category || undefined,
      images: allImages,
      isActive: formData.isActive,
    };

    // Zod validation
    const validation = zodValidator(validationData, updateListingZodSchema);
    if (!validation.success) {
      setValidationErrors(validation);
      const errorCount = validation.errors?.length || 0;
      const firstError = validation.errors?.[0]?.message || "Validation failed";
      if (errorCount === 1) {
        toast.error(firstError);
      } else {
        toast.error(
          `${errorCount} validation errors found. Please check the form fields.`
        );
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateListing({
        id: listingId,
        ...validationData,
      });

      if (result.success) {
        toast.success("Tour listing updated successfully!");
        router.refresh(); // Refresh server-side data
        router.push("/guide/dashboard?refresh=" + Date.now()); // Add timestamp to force client-side refresh
      } else {
        toast.error(result.message || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("An error occurred while updating the listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
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
              <h1 className="text-2xl font-bold text-foreground">Edit Tour</h1>
              <p className="mt-2 text-muted-foreground">
                Update your tour listing
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
                noValidate
              >
                {/* Basic Info */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Basic Information
                  </h2>

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
                    <Select
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InputFieldError
                      field="category"
                      state={validationErrors}
                    />
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
                    <InputFieldError
                      field="description"
                      state={validationErrors}
                    />
                  </div>
                </div>

                {/* Tour Status */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Tour Status
                  </h2>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive" className="text-base">
                        Tour Status
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.isActive
                          ? "Your tour is currently active and visible to tourists"
                          : "Your tour is currently inactive and hidden from tourists"}
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isActive: checked }))
                      }
                    />
                  </div>
                </div>

                {/* Tour Details */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Tour Details
                  </h2>

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
                      <InputFieldError
                        field="durationDays"
                        state={validationErrors}
                      />
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
                      <InputFieldError
                        field="tourFee"
                        state={validationErrors}
                      />
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
                      <InputFieldError
                        field="maxGroupSize"
                        state={validationErrors}
                      />
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
                    <InputFieldError
                      field="meetingPoint"
                      state={validationErrors}
                    />
                  </div>
                </div>

                {/* Itinerary */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Itinerary
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Add the main stops or activities in your tour
                  </p>

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
                    <InputFieldError
                      field="itinerary"
                      state={validationErrors}
                    />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Photos
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your tour photos
                  </p>
                  <InputFieldError field="images" state={validationErrors} />

                  <div className="space-y-4">
                    {existingImages.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Existing Photos</Label>
                        <div className="grid gap-4 sm:grid-cols-3">
                          {existingImages.map((imageUrl, index) => (
                            <div
                              key={index}
                              className="relative aspect-video overflow-hidden rounded-lg border-2 border-border"
                            >
                              <Image
                                src={imageUrl}
                                alt={`Existing ${index + 1}`}
                                className="h-full w-full object-cover"
                                width={300}
                                height={300}
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {imagePreviews.length > 0 && (
                      <div>
                        <Label className="mb-2 block">New Photos</Label>
                        <div className="grid gap-4 sm:grid-cols-3">
                          {imagePreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="relative aspect-video overflow-hidden rounded-lg border-2 border-border"
                            >
                              <Image
                                src={preview}
                                alt={`New ${index + 1}`}
                                className="h-full w-full object-cover"
                                width={300}
                                height={300}
                              />
                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {existingImages.length + imageFiles.length < 10 && (
                      <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">
                          Upload Photo
                        </span>
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

                {/* Submit */}
                <div className="flex gap-4 border-t border-border pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 sm:flex-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Tour"
                    )}
                  </Button>
                  <Link href="/guide/dashboard" className="flex-1 sm:flex-none">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full bg-transparent"
                      disabled={isSubmitting}
                    >
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
  );
}
