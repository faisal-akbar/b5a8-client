"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { createAvailability } from "@/services/availability/availability.service"
import type { GuideAvailability, GuideListing } from "@/types/guide"

interface AvailabilityQuickAddProps {
  listings: GuideListing[]
  availabilities: GuideAvailability[]
  onSuccess: () => void
}

export function AvailabilityQuickAdd({ listings, availabilities, onSuccess }: AvailabilityQuickAddProps) {
  const [listingId, setListingId] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateBulk = async () => {
    if (!listingId || !selectedDate) {
      toast.error("Please select a listing and date")
      return
    }

    // Create availability for the selected date (9 AM to 5 PM)
    const startDate = new Date(selectedDate)
    startDate.setHours(9, 0, 0, 0)
    const endDate = new Date(selectedDate)
    endDate.setHours(17, 0, 0, 0)

    try {
      setIsSubmitting(true)
      const result = await createAvailability({
        listingId,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        isAvailable: true,
      })

      if (result.success) {
        toast.success("Availability created successfully")
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
    <Card>
      <CardHeader>
        <CardTitle>Quick Add</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Listing</Label>
          <Select value={listingId} onValueChange={setListingId} >
            <SelectTrigger  className="w-full">
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
        </div>

        <div className="space-y-2">
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            className="w-full"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              // Disable past dates
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today
            }}
            modifiers={{
              hasAvailability: availabilities
                .filter((a) => a.isAvailable)
                .map((a) => {
                  const date = new Date(a.startDateTime)
                  date.setHours(0, 0, 0, 0)
                  return date
                }),
            }}
            modifiersClassNames={{
              hasAvailability: "bg-primary/10 text-primary font-semibold",
            }}
          />
          {/* {availabilities.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {availabilities.filter((a) => a.isAvailable).length} available date{availabilities.filter((a) => a.isAvailable).length !== 1 ? "s" : ""} set
            </p>
          )} */}
        </div>

        <Button
          onClick={handleCreateBulk}
          className="w-full"
          disabled={!listingId || !selectedDate || isSubmitting}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isSubmitting ? "Adding..." : "Add for Selected Date"}
        </Button>
      </CardContent>
    </Card>
  )
}

