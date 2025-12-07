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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createReview } from "@/services/review/review.service"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  tourTitle: string
  guideName: string
  bookingId: string
  onSuccess?: () => void
}

export function ReviewModal({
  isOpen,
  onClose,
  tourTitle,
  guideName,
  bookingId,
  onSuccess
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0 || review.trim().length === 0) {
      toast.error("Please provide a rating and review")
      return
    }

    try {
      setIsSubmitting(true)
      const result = await createReview({
        bookingId,
        rating,
        comment: review.trim(),
      })

      if (result.success) {
        toast.success("Review submitted successfully!")
        // Reset form
        setRating(0)
        setReview("")
        onClose()
        // Call onSuccess callback to refresh data
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(result.message || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("An error occurred while submitting your review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>Share your experience on {tourTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Rate your experience</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`h-10 w-10 ${star <= (hoveredRating || rating) ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 5
                  ? "Excellent!"
                  : rating === 4
                    ? "Great!"
                    : rating === 3
                      ? "Good"
                      : rating === 2
                        ? "Fair"
                        : "Poor"}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              placeholder={`Tell us about your experience with ${guideName}...`}
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || review.trim().length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
