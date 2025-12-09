import { TourDetailsClient } from "@/components/tours/tour-details-client"
import { getListingById } from "@/services/listing/listing.service"
import { getReviews } from "@/services/review/review.service"
import { notFound } from "next/navigation"
import type { GuideListing, GuideReview } from "@/types/guide"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TourDetailsPage({ params }: PageProps) {
  const { id } = await params

  try {
    // Fetch listing - it includes reviews in the response
    const listingResult = await getListingById(id)

    if (!listingResult.success || !listingResult.data) {
      notFound()
    }

    const listing: any = listingResult.data

    // Extract reviews from listing response (if available) or fetch separately
    let reviews: GuideReview[] = []
    if (listing.reviews && Array.isArray(listing.reviews)) {
      // Reviews are included in the listing response
      reviews = listing.reviews.map((review: any) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment || null,
        listing: {
          id: listing.id,
          title: listing.title,
        },
        tourist: {
          user: {
            name: review.tourist?.user?.name || "Anonymous",
            profilePic: review.tourist?.user?.profilePic || null,
          },
        },
        createdAt: review.createdAt,
      }))
    } else {
      // Fallback: fetch reviews separately if not in listing response
      const reviewsResult = await getReviews({ listingId: id, page: 1, limit: 50 })
      if (reviewsResult.success && reviewsResult.data) {
        reviews = Array.isArray(reviewsResult.data)
          ? reviewsResult.data
          : (Array.isArray(reviewsResult.data?.data) ? reviewsResult.data.data : [])
      }
    }

    // Transform guide profile data (guide-specific info only, not listing-specific metrics)
    const guideProfile = listing.guide ? {
      name: listing.guide.user?.name || "Guide",
      profilePic: listing.guide.user?.profilePic ?? null,
      bio: listing.guide.user?.bio ?? null,
      languages: listing.guide.user?.languages ?? [],
      expertise: listing.guide.expertise ?? [],
      dailyRate: listing.guide.dailyRate ?? null,
      verified: listing.guide.user?.isVerified ?? false,
      // Note: rating and reviewsCount are listing-specific, not guide-specific
      // They are already available in the listing object itself
    } : undefined

    // Extract availabilities with default empty array
    const availabilities = listing.availabilities ?? []

    // Transform listing data with proper type safety
    const listingData: GuideListing = {
      ...listing,
      itinerary: listing.itinerary ?? "",
      images: listing.images ?? [],
      guideId: listing.guideId || listing.guide?.id,
      averageRating: listing.averageRating ?? null,
      _count: {
        bookings: listing._count?.bookings ?? 0,
        reviews: listing._count?.reviews ?? 0,
      },
      // Add backward compatibility fields
      bookingsCount: listing._count?.bookings ?? 0,
      reviewsCount: listing._count?.reviews ?? 0,
    }

    

    return (
      <div className="flex min-h-screen flex-col">
        
        <main className="flex-1 pb-16">
          <TourDetailsClient
            listing={listingData}
            reviews={reviews}
            guideProfile={guideProfile}
            availabilities={availabilities}
          />
        </main>
        
      </div>
    )
  } catch (error) {
    console.error("Error fetching tour details:", error)
    notFound()
  }
}
