"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { AvailabilityTable } from "./availability-table"
import { AvailabilityCreateDialog } from "./availability-create-dialog"
import { AvailabilityEditDialog } from "./availability-edit-dialog"
import { AvailabilityDeleteDialog } from "./availability-delete-dialog"
import { AvailabilityQuickAdd } from "./availability-quick-add"
import type { GuideAvailability, GuideListing } from "@/types/guide"

interface AvailabilityClientProps {
  initialAvailabilities: GuideAvailability[]
  initialListings: GuideListing[]
}

export function AvailabilityClient({ initialAvailabilities, initialListings }: AvailabilityClientProps) {
  const router = useRouter()
  const [availabilities, setAvailabilities] = useState<GuideAvailability[]>(initialAvailabilities)
  const [listings] = useState<GuideListing[]>(initialListings)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAvailability, setSelectedAvailability] = useState<GuideAvailability | null>(null)

  // Sync state when initial data changes (e.g., after server refresh)
  useEffect(() => {
    setAvailabilities(initialAvailabilities)
  }, [initialAvailabilities])

  const handleRefresh = () => {
    router.refresh()
  }

  const handleEdit = (availability: GuideAvailability) => {
    setSelectedAvailability(availability)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (availability: GuideAvailability) => {
    setSelectedAvailability(availability)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Availability Schedule</CardTitle>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Availability
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availabilities.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No availability set</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your available dates and times for bookings
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Availability
                </Button>
              </div>
            ) : (
              <AvailabilityTable
                availabilities={availabilities}
                listings={listings}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>

        <AvailabilityQuickAdd
          listings={listings}
          availabilities={availabilities}
          onSuccess={handleRefresh}
        />
      </div>

      <AvailabilityCreateDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        listings={listings}
        onSuccess={handleRefresh}
      />

      <AvailabilityEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        availability={selectedAvailability}
        onSuccess={handleRefresh}
      />

      <AvailabilityDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        availability={selectedAvailability}
        onSuccess={handleRefresh}
      />
    </>
  )
}

