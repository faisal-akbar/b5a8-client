"use client"

import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Calendar as CalendarIcon, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import {
  getMyAvailabilities,
  createAvailability,
  createBulkAvailability,
  updateAvailability,
  deleteAvailability,
} from "@/services/availability/availability.service"
import { getMyListings } from "@/services/listing/listing.service"
import type { GuideAvailability, GuideListing } from "@/types/guide"
import type { ColumnDef } from "@tanstack/react-table"
import { createAvailabilityZodSchema, updateAvailabilityZodSchema } from "@/zod/availability.validation"
import { zodValidator } from "@/lib/zodValidator"
import InputFieldError from "@/components/shared/InputFieldError"
import type { IInputErrorState } from "@/lib/getInputFieldError"

export default function AvailabilityPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [availabilities, setAvailabilities] = useState<GuideAvailability[]>([])
  const [listings, setListings] = useState<GuideListing[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAvailability, setSelectedAvailability] = useState<GuideAvailability | null>(null)
  const [formData, setFormData] = useState({
    listingId: "",
    startDateTime: "",
    endDateTime: "",
    isAvailable: true,
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [validationErrors, setValidationErrors] = useState<IInputErrorState | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [availabilitiesResult, listingsResult] = await Promise.all([
        getMyAvailabilities({ page: 1, limit: 100 }),
        getMyListings({ page: 1, limit: 100 }),
      ])

      if (availabilitiesResult.success && availabilitiesResult.data) {
        setAvailabilities(availabilitiesResult.data.data || [])
      }

      if (listingsResult.success && listingsResult.data) {
        setListings(listingsResult.data.data || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load availability data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreateAvailability = async () => {
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
      setValidationErrors(validation)
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
      const result = await createAvailability(validationData)

      if (result.success) {
        toast.success("Availability created successfully")
        setIsCreateDialogOpen(false)
        setFormData({
          listingId: "",
          startDateTime: "",
          endDateTime: "",
          isAvailable: true,
        })
        setValidationErrors(null)
        fetchData()
      } else {
        toast.error(result.message || "Failed to create availability")
      }
    } catch (error) {
      toast.error("An error occurred while creating availability")
    }
  }

  const handleUpdateAvailability = async () => {
    if (!selectedAvailability) return
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
      setValidationErrors(validation)
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
      const result = await updateAvailability({
        id: selectedAvailability.id,
        ...validationData,
      })

      if (result.success) {
        toast.success("Availability updated successfully")
        setIsEditDialogOpen(false)
        setSelectedAvailability(null)
        setValidationErrors(null)
        fetchData()
      } else {
        toast.error(result.message || "Failed to update availability")
      }
    } catch (error) {
      toast.error("An error occurred while updating availability")
    }
  }

  const handleDeleteAvailability = async () => {
    if (!selectedAvailability) return

    try {
      const result = await deleteAvailability(selectedAvailability.id)

      if (result.success) {
        toast.success("Availability deleted successfully")
        setIsDeleteDialogOpen(false)
        setSelectedAvailability(null)
        fetchData()
      } else {
        toast.error(result.message || "Failed to delete availability")
      }
    } catch (error) {
      toast.error("An error occurred while deleting availability")
    }
  }

  const handleEditClick = (availability: GuideAvailability) => {
    setSelectedAvailability(availability)
    setFormData({
      listingId: availability.listingId,
      startDateTime: availability.startDateTime,
      endDateTime: availability.endDateTime,
      isAvailable: availability.isAvailable,
    })
    setIsEditDialogOpen(true)
  }

  const handleCreateBulk = async () => {
    if (!formData.listingId || !selectedDate) {
      toast.error("Please select a listing and date")
      return
    }

    // Create availability for the selected date (9 AM to 5 PM)
    const startDate = new Date(selectedDate)
    startDate.setHours(9, 0, 0, 0)
    const endDate = new Date(selectedDate)
    endDate.setHours(17, 0, 0, 0)

    try {
      const result = await createAvailability({
        listingId: formData.listingId,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        isAvailable: true,
      })

      if (result.success) {
        toast.success("Availability created successfully")
        fetchData()
      } else {
        toast.error(result.message || "Failed to create availability")
      }
    } catch (error) {
      toast.error("An error occurred while creating availability")
    }
  }

  const columns: ColumnDef<GuideAvailability>[] = [
    {
      accessorKey: "listing.title",
      header: "Listing",
      cell: ({ row }) => {
        const listing = listings.find((l) => l.id === row.original.listingId)
        return listing?.title || "N/A"
      },
    },
    {
      accessorKey: "startDateTime",
      header: "Start Date & Time",
      cell: ({ row }) => {
        const date = new Date(row.getValue("startDateTime"))
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      },
    },
    {
      accessorKey: "endDateTime",
      header: "End Date & Time",
      cell: ({ row }) => {
        const date = new Date(row.getValue("endDateTime"))
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      },
    },
    {
      accessorKey: "isAvailable",
      header: "Status",
      cell: ({ row }) => {
        const isAvailable = row.getValue("isAvailable") as boolean
        return (
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Available" : "Unavailable"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const availability = row.original
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditClick(availability)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setSelectedAvailability(availability)
                setIsDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/guide/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Manage Availability</h1>
            <p className="mt-2 text-muted-foreground">Set your available dates and times for bookings</p>
          </div>

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
                <DataTable
                  columns={columns}
                  data={availabilities}
                  searchKey="listing.title"
                  searchPlaceholder="Search by listing..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Add</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Listing</Label>
                  <Select
                    value={formData.listingId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, listingId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a listing" />
                    </SelectTrigger>
                    <SelectContent>
                      {listings.map((listing) => (
                        <SelectItem key={listing.id} value={listing.id}>
                          {listing.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <Button onClick={handleCreateBulk} className="w-full" disabled={!formData.listingId || !selectedDate}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Add for Selected Date
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                  {listings.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id}>
                      {listing.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAvailability}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAvailability}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Availability</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this availability? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAvailability}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

