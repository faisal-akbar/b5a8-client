"use client"

import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import type { GuideAvailability, GuideListing } from "@/types/guide"
import type { ColumnDef } from "@tanstack/react-table"

interface AvailabilityTableProps {
  availabilities: GuideAvailability[]
  listings: GuideListing[]
  onEdit: (availability: GuideAvailability) => void
  onDelete: (availability: GuideAvailability) => void
}

export function AvailabilityTable({ availabilities, listings, onEdit, onDelete }: AvailabilityTableProps) {
  const columns: ColumnDef<GuideAvailability>[] = [
    {
      accessorKey: "listing.title",
      header: "Tour/Listing",
      cell: ({ row }) => {
        const listing = listings.find((l) => l.id === row.original.listingId)
        return listing?.title || row.original.listing?.title || "N/A"
      },
    },
    {
      accessorKey: "startDateTime",
      header: "Start Date & Time",
      cell: ({ row }) => {
        const dateStr = row.getValue("startDateTime") as string
        if (!dateStr) return "N/A"
        try {
          const date = new Date(dateStr)
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-sm text-muted-foreground">
                {date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )
        } catch {
          return dateStr
        }
      },
    },
    {
      accessorKey: "endDateTime",
      header: "End Date & Time",
      cell: ({ row }) => {
        const dateStr = row.getValue("endDateTime") as string
        if (!dateStr) return "N/A"
        try {
          const date = new Date(dateStr)
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-sm text-muted-foreground">
                {date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )
        } catch {
          return dateStr
        }
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
              onClick={() => onEdit(availability)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(availability)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={availabilities}
      searchKey="listing.title"
      searchPlaceholder="Search by listing..."
    />
  )
}

