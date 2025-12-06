"use client"

import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import type { GuideAvailability, GuideListing } from "@/types/guide"
import type { ColumnDef } from "@tanstack/react-table"
import { AvailabilityPagination } from "./availability-pagination"

interface AvailabilityTableProps {
  availabilities: GuideAvailability[]
  listings: GuideListing[]
  onEdit: (availability: GuideAvailability) => void
  onDelete: (availability: GuideAvailability) => void
  currentPage: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function AvailabilityTable({
  availabilities,
  listings,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: AvailabilityTableProps) {
  // Create a helper function to get listing title
  const getListingTitle = (availability: GuideAvailability): string => {
    const listing = listings.find((l) => l.id === availability.listingId)
    return listing?.title || availability.listing?.title || "N/A"
  }

  const columns: ColumnDef<GuideAvailability>[] = [
    {
      accessorFn: (row) => getListingTitle(row),
      id: "listingTitle",
      header: "Tour/Listing",
      cell: ({ row }) => {
        return getListingTitle(row.original)
      },
      filterFn: (row, id, value) => {
        const title = getListingTitle(row.original)
        return title.toLowerCase().includes(value.toLowerCase())
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
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={availabilities}
        searchKey="listingTitle"
        searchPlaceholder="Search by listing..."
        disablePagination={true}
      />
      {availabilities.length > 0 && (
        <AvailabilityPagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  )
}

