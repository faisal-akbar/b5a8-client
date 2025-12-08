"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import { toast } from "sonner"
import { createAvailability } from "@/services/availability/availability.service"
import type { GuideListing } from "@/types/guide"
import { createAvailabilityZodSchema } from "@/zod/availability.validation"
import { zodValidator } from "@/lib/zodValidator"
import InputFieldError from "@/components/shared/InputFieldError"
import type { IInputErrorState } from "@/lib/getInputFieldError"

interface AvailabilityCreateDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  listings: GuideListing[]
  onSuccess: () => void
}

export function AvailabilityCreateDialog({
  isOpen,
  onOpenChange,
  listings,
  onSuccess,
}: AvailabilityCreateDialogProps) {
  const [formData, setFormData] = useState({
    listingId: "",
    startDateTime: "",
    endDateTime: "",
    isAvailable: true,
  })
  const [validationErrors, setValidationErrors] = useState<IInputErrorState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setValidationErrors(null)

    // Convert datetime-local to ISO string
    const startDateTime = formData.startDateTime ? new Date(formData.startDateTime).toISOString() : ""
    const endDateTime = formData.endDateTime ? new Date(formData.endDateTime).toISOString() : ""

    const validationData = {
      listingId: formData.listingId,
      startDateTime,
      endDateTime,
      isAvailable: formData.isAvailable,
    }

    const validation = zodValidator(validationData, createAvailabilityZodSchema)
    if (!validation.success) {
      setValidationErrors(validation as IInputErrorState)
      const errorCount = validation.errors?.length || 0
      const firstError = validation.errors?.[0]?.message || "Validation failed"
      if (errorCount === 1) {
        toast.error(firstError)
      } else {
        toast.error(`${errorCount} validation errors found. Please check the form fields.`)
      }
      return
    }

    try {
      setIsSubmitting(true)
      const result = await createAvailability(validationData)

      if (result.success) {
        toast.success("Availability created successfully")
        onOpenChange(false)
        setFormData({
          listingId: "",
          startDateTime: "",
          endDateTime: "",
          isAvailable: true,
        })
        setValidationErrors(null)
        onSuccess()
      } else {
        toast.error(result.message || "Failed to create availability")
      }
    } catch (error) {
      toast.error("An error occurred while creating availability")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Availability</DialogTitle>
          <DialogDescription>Set a new availability slot for your listing</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Listing *</Label>
            <Select
              value={formData.listingId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, listingId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a listing" />
              </SelectTrigger>
              <SelectContent>
                {listings.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No listings available
                  </div>
                ) : (
                  listings.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id}>
                      {listing.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {listings.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/guide/dashboard/listings/new" className="text-primary hover:underline">
                  Create a tour listing
                </Link>{" "}
                first to set availability
              </p>
            )}
            <InputFieldError field="listingId" state={validationErrors} />
          </div>
          <div className="space-y-2">
            <Label>Start Date & Time *</Label>
            <Input
              type="datetime-local"
              value={formData.startDateTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDateTime: e.target.value }))}
            />
            <InputFieldError field="startDateTime" state={validationErrors} />
          </div>
          <div className="space-y-2">
            <Label>End Date & Time *</Label>
            <Input
              type="datetime-local"
              value={formData.endDateTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDateTime: e.target.value }))}
            />
            <InputFieldError field="endDateTime" state={validationErrors} />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData((prev) => ({ ...prev, isAvailable: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isAvailable">Available</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}




