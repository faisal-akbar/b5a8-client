"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { deleteAvailability } from "@/services/availability/availability.service"
import type { GuideAvailability } from "@/types/guide"

interface AvailabilityDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  availability: GuideAvailability | null
  onSuccess: () => void
}

export function AvailabilityDeleteDialog({
  isOpen,
  onOpenChange,
  availability,
  onSuccess,
}: AvailabilityDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!availability) return

    try {
      setIsDeleting(true)
      const result = await deleteAvailability(availability.id)

      if (result.success) {
        toast.success("Availability deleted successfully")
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(result.message || "Failed to delete availability")
      }
    } catch (error) {
      toast.error("An error occurred while deleting availability")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Availability</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this availability? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



