"use client"

import { useState, useEffect } from "react"
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
import { createReview, updateReview, getReviewByBookingId } from "@/services/review/review.service"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  tourTitle: string
  guideName: string
  bookingId: string
  mode?: "create" | "edit" // Edit mode for viewing/updating existing review
  onSuccess?: () => void
}

export function ReviewModal({
  isOpen,
  onClose,
  tourTitle,
  guideName,
  bookingId,
  mode = "create",
  onSuccess
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [originalRating, setOriginalRating] = useState(0)
  const [originalReview, setOriginalReview] = useState("")

  // Load existing review if in edit mode
  useEffect(() => {
    if (isOpen && mode === "edit") {
      loadExistingReview()
    } else if (isOpen && mode === "create") {
      // Reset form for create mode
      setRating(0)
      setReview("")
      setIsEditMode(false)
      setReviewId(null)
    }
  }, [isOpen, mode, bookingId])

  const loadExistingReview = async () => {
    setIsLoading(true)
    try {
      const result = await getReviewByBookingId(bookingId)
      if (result.success && result.data) {
        setRating(result.data.rating)
        setReview(result.data.comment || "")
        setReviewId(result.data.id)
        setOriginalRating(result.data.rating)
        setOriginalReview(result.data.comment || "")
        setIsEditMode(false) // Start in view mode
      } else {
        toast.error("Failed to load review")
        onClose()
      }
    } catch (error) {
      console.error("Error loading review:", error)
      toast.error("Failed to load review")
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (rating === 0 || review.trim().length === 0) {
      toast.error("Please provide a rating and review")
      return
    }

    try {
      setIsSubmitting(true)
      
      let result
      if (mode === "edit" && reviewId) {
        // Update existing review
        result = await updateReview({
          id: reviewId,
          rating,
          comment: review.trim(),
        })
      } else {
        // Create new review
        result = await createReview({
          bookingId,
          rating,
          comment: review.trim(),
        })
      }

      if (result.success) {
        toast.success(mode === "edit" ? "Review updated successfully!" : "Review submitted successfully!")
        // Reset form
        setRating(0)
        setReview("")
        setIsEditMode(false)
        onClose()
        // Call onSuccess callback to refresh data
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(result.message || `Failed to ${mode === "edit" ? "update" : "submit"} review`)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error(`An error occurred while ${mode === "edit" ? "updating" : "submitting"} your review`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (mode === "edit" && !isEditMode) {
      // In view mode, just close
      onClose()
    } else if (mode === "edit" && isEditMode) {
      // Cancel edit, restore original values
      setRating(originalRating)
      setReview(originalReview)
      setIsEditMode(false)
    } else {
      // Create mode, just close
      onClose()
    }
  }

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const isViewMode = mode === "edit" && !isEditMode

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Write a Review" : isEditMode ? "Edit Review" : "Your Review"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? `Share your experience on ${tourTitle}`
              : `Your review for ${tourTitle}`
            }
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => !isViewMode && setRating(star)}
                      onMouseEnter={() => !isViewMode && setHoveredRating(star)}
                      onMouseLeave={() => !isViewMode && setHoveredRating(0)}
                      className={`transition-transform ${!isViewMode ? "hover:scale-110" : ""}`}
                      disabled={isSubmitting || isViewMode}
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || rating) 
                            ? "fill-primary text-primary" 
                            : "text-muted-foreground"
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
                  disabled={isSubmitting || isViewMode}
                  className={isViewMode ? "resize-none" : ""}
                />
              </div>
            </div>

            <DialogFooter>
              {isViewMode ? (
                <>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={handleEdit}>
                    Edit Review
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={rating === 0 || review.trim().length === 0 || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {mode === "edit" ? "Updating..." : "Submitting..."}
                      </>
                    ) : (
                      mode === "edit" ? "Update Review" : "Submit Review"
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
