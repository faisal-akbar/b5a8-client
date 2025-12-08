"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { updateAvailability } from "@/services/availability/availability.service"
import type { GuideAvailability } from "@/types/guide"
import { updateAvailabilityZodSchema } from "@/zod/availability.validation"
import { zodValidator } from "@/lib/zodValidator"
import InputFieldError from "@/components/shared/InputFieldError"
import type { IInputErrorState } from "@/lib/getInputFieldError"

interface AvailabilityEditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  availability: GuideAvailability | null
  onSuccess: () => void
}

export function AvailabilityEditDialog({
  isOpen,
  onOpenChange,
  availability,
  onSuccess,
}: AvailabilityEditDialogProps) {
  const [formData, setFormData] = useState({
    startDateTime: "",
    endDateTime: "",
    isAvailable: true,
  })
  const [validationErrors, setValidationErrors] = useState<IInputErrorState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (availability) {
      setFormData({
        startDateTime: availability.startDateTime,
        endDateTime: availability.endDateTime,
        isAvailable: availability.isAvailable,
      })
    }
  }, [availability])

  const handleSubmit = async () => {
    if (!availability) return
    setValidationErrors(null)

    // Convert datetime-local to ISO string if provided
    const startDateTime = formData.startDateTime ? new Date(formData.startDateTime).toISOString() : undefined
    const endDateTime = formData.endDateTime ? new Date(formData.endDateTime).toISOString() : undefined

    const validationData = {
      startDateTime,
      endDateTime,
      isAvailable: formData.isAvailable,
    }

    const validation = zodValidator(validationData, updateAvailabilityZodSchema)
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
      const result = await updateAvailability({
        id: availability.id,
        ...validationData,
      })

      if (result.success) {
        toast.success("Availability updated successfully")
        onOpenChange(false)
        setValidationErrors(null)
        onSuccess()
      } else {
        toast.error(result.message || "Failed to update availability")
      }
    } catch (error) {
      toast.error("An error occurred while updating availability")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Availability</DialogTitle>
          <DialogDescription>Update availability details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Start Date & Time *</Label>
            <Input
              type="datetime-local"
              value={formData.startDateTime ? new Date(formData.startDateTime).toISOString().slice(0, 16) : ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDateTime: e.target.value }))}
            />
            <InputFieldError field="startDateTime" state={validationErrors} />
          </div>
          <div className="space-y-2">
            <Label>End Date & Time *</Label>
            <Input
              type="datetime-local"
              value={formData.endDateTime ? new Date(formData.endDateTime).toISOString().slice(0, 16) : ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDateTime: e.target.value }))}
            />
            <InputFieldError field="endDateTime" state={validationErrors} />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailableEdit"
              checked={formData.isAvailable}
              onChange={(e) => setFormData((prev) => ({ ...prev, isAvailable: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isAvailableEdit">Available</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}




