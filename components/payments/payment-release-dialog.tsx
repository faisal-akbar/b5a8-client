"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { releasePaymentToGuide } from "@/services/payment/payment.service"
import type { GuidePayment } from "@/types/guide"

interface PaymentReleaseDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  payment: GuidePayment | null
  onSuccess: () => void
}

export function PaymentReleaseDialog({
  isOpen,
  onOpenChange,
  payment,
  onSuccess,
}: PaymentReleaseDialogProps) {
  const [isReleasing, setIsReleasing] = useState(false)

  const handleReleasePayment = async () => {
    if (!payment) return

    try {
      setIsReleasing(true)
      const result = await releasePaymentToGuide(payment.id)

      if (result.success) {
        toast.success("Payment released successfully")
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(result.message || "Failed to release payment")
      }
    } catch (error) {
      console.error("Error releasing payment:", error)
      toast.error("An error occurred while releasing payment")
    } finally {
      setIsReleasing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Release Payment</DialogTitle>
          <DialogDescription>
            Are you sure you want to release this payment? This action will transfer the funds to your account. 
            This can only be done after the tour has been completed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isReleasing}>
            Cancel
          </Button>
          <Button onClick={handleReleasePayment} disabled={isReleasing}>
            {isReleasing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Releasing...
              </>
            ) : (
              "Release Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}





