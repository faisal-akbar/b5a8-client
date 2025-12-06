import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { TourDetailsClient } from "@/components/tours/tour-details-client"
import { getListingById } from "@/services/listing/listing.service"
import { getReviews } from "@/services/review/review.service"
import { getUserById } from "@/services/user/user.service"
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

    // Extract guide information from listing response
    let guideProfile = undefined
    if (listing.guide) {
      guideProfile = {
        name: listing.guide.user?.name || "Guide",
        profilePic: listing.guide.user?.profilePic || null,
        bio: listing.guide.user?.bio || null,
        rating: listing.averageRating || 0,
        reviewsCount: listing._count?.reviews || 0,
        languages: listing.guide.user?.languages || [],
        expertise: listing.guide.expertise || [],
        dailyRate: listing.guide.dailyRate || null,
        verified: false, // Add if available in API
      }
    }

    // Extract availabilities for date selection
    const availabilities = listing.availabilities || []

    // Prepare listing data with all fields
    const listingData: GuideListing = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      itinerary: listing.itinerary || "",
      tourFee: listing.tourFee,
      durationDays: listing.durationDays,
      meetingPoint: listing.meetingPoint,
      maxGroupSize: listing.maxGroupSize,
      city: listing.city,
      category: listing.category,
      images: listing.images || [],
      isActive: listing.isActive,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      guide: listing.guide ? {
        id: listing.guide.id,
        user: {
          id: listing.guide.user.id,
          name: listing.guide.user.name,
        },
      } : undefined,
      bookingsCount: listing._count?.bookings || 0,
      averageRating: listing.averageRating || 0,
      reviewsCount: listing._count?.reviews || 0,
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
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error fetching tour details:", error)
    notFound()
  }
}
