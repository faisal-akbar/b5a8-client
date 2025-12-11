import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { getMyBookings } from "@/services/booking/booking.service";
import { getMyReviews } from "@/services/review/review.service";
import { getMyWishlist } from "@/services/wishlist/wishlist.service";
import { Suspense } from "react";
import { TouristDashboardClient } from "./tourist-dashboard-client";

export const dynamic = "force-dynamic";

// Types for API responses
interface Listing {
  id: string;
  title: string;
  description?: string;
  location?: string;
  city: string;
  price?: number;
  tourFee: number;
  duration?: number;
  durationDays?: number;
  maxGroupSize?: number;
  images: string[];
  category?: string;
  guide?: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    averageRating?: number;
    user?: {
      id: string;
      name: string;
      profilePic: string | null;
    };
  };
  _count?: {
    bookings: number;
    reviews: number;
  };
}

interface ApiBooking {
  id: string;
  listingId: string;
  touristId: string;
  guideId: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  numberOfGuests: number;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
  listing: {
    id: string;
    title: string;
    images: string[];
    tourFee: number;
    city: string;
    meetingPoint?: string;
    category?: string;
    durationDays?: number;
  };
  tourist: {
    id: string;
    travelPreferences: string[];
    user: {
      id: string;
      name: string;
      profilePic: string | null;
    };
  };
  guide: {
    id: string;
    expertise: string[];
    dailyRate: number;
    stripeAccountId: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      profilePic: string | null;
    };
  };
  payment: {
    id: string;
    amount: number;
    status: "PAID" | "UNPAID" | "REFUNDED" | "PARTIALLY_REFUNDED";
    provider: string;
    trxId: string | null;
    stripePaymentIntentId: string | null;
    stripeChargeId: string | null;
    stripeTransferId: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
}

interface WishlistItem {
  id: string;
  listingId: string;
  touristId: string;
  createdAt: string;
  listing: Listing;
}

type Booking = {
  id: string;
  tourTitle: string;
  tourImage: string;
  guide: string;
  guideImage: string | null;
  location: string;
  city: string;
  date: string;
  guests: number;
  price: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt: string;
  paymentStatus: string;
  paymentAmount?: number;
  paymentProvider?: string;
  rating?: number;
  reviewed?: boolean;
  meetingPoint?: string;
  category?: string;
  durationDays?: number;
  guideEmail?: string;
  totalPrice?: number;
};

type WishlistTableItem = {
  id: string;
  tourTitle: string;
  tourImage: string;
  guide: string;
  location: string;
  category: string;
  price: number;
  durationDays: number;
  bookingsCount: number;
  reviewsCount: number;
  listingId: string;
};

type TouristReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  listing: {
    title: string;
  } | null;
  guide: {
    user: {
      name: string;
    };
  } | null;
};

// Transform API booking to table booking
function transformBooking(apiBooking: ApiBooking): Booking {
  try {
    return {
      id: apiBooking.id,
      tourTitle: apiBooking.listing?.title || "Unknown Tour",
      tourImage: apiBooking.listing?.images?.[0] || "/placeholder.svg",
      guide: apiBooking.guide?.user?.name || "Unknown Guide",
      guideImage: apiBooking.guide?.user?.profilePic || null,
      location: apiBooking.listing?.city || "Unknown Location",
      city: apiBooking.listing?.city || "Unknown City",
      date: apiBooking.date,
      guests: apiBooking.numberOfGuests || 1,
      price: apiBooking.listing?.tourFee || 0,
      status: (apiBooking.status || "PENDING").toLowerCase() as
        | "confirmed"
        | "pending"
        | "completed"
        | "cancelled",
      createdAt: apiBooking.createdAt,
      paymentStatus: apiBooking.payment?.status || "UNPAID",
      paymentAmount: apiBooking.payment?.amount
        ? apiBooking.payment.amount
        : undefined,
      paymentProvider: apiBooking.payment?.provider || undefined,
      stripePaymentIntentId: apiBooking.payment?.stripePaymentIntentId || null,
      rating: apiBooking.review?.rating,
      reviewed: !!apiBooking.review,
      meetingPoint: apiBooking.listing?.meetingPoint,
      category: apiBooking.listing?.category,
      durationDays: apiBooking.listing?.durationDays,
      guideEmail: apiBooking.guide?.user?.email,
      totalPrice: apiBooking.payment?.amount
        ? apiBooking.payment.amount
        : apiBooking.listing?.tourFee || 0,
    };
  } catch (error) {
    console.error("Error transforming booking:", error, apiBooking);
    throw error;
  }
}

// Transform wishlist item to table item
function transformWishlistItem(item: WishlistItem): WishlistTableItem {
  try {
    return {
      id: item.id,
      tourTitle: item.listing?.title || "Unknown Tour",
      tourImage: item.listing?.images?.[0] || "/placeholder.svg",
      guide: item.listing?.guide?.user?.name || "N/A",
      location: item.listing?.city || "Unknown",
      category: item.listing?.category || "General",
      price: item.listing?.tourFee || 0,
      durationDays: item.listing?.durationDays || item.listing?.duration || 0,
      bookingsCount: item.listing?._count?.bookings || 0,
      reviewsCount: item.listing?._count?.reviews || 0,
      listingId: item.listingId,
    };
  } catch (error) {
    console.error("Error transforming wishlist item:", error, item);
    throw error;
  }
}

export default async function TouristDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    // Get pagination and tab parameters from URL
    const params = await searchParams;
    const activeTab = (params.tab as string) || "upcoming";
    const page = parseInt((params.page as string) || "1", 10);
    const limit = parseInt(
      (params.limit as string) || (activeTab === "reviews" ? "5" : "10"),
      10
    );

    // Determine which data to fetch based on active tab
    let upcomingResult,
      pendingResult,
      pastResult,
      wishlistResult,
      reviewsResult;

    if (activeTab === "upcoming") {
      upcomingResult = await getMyBookings({
        type: "upcoming",
        status: "CONFIRMED",
        page,
        limit,
      });
      // Fetch others with default pagination for stats
      pendingResult = await getMyBookings({
        status: "PENDING",
        page: 1,
        limit: 1,
      });
      pastResult = await getMyBookings({
        type: "past",
        status: "COMPLETED",
        page: 1,
        limit: 1,
      });
      wishlistResult = await getMyWishlist({ page: 1, limit: 1 });
      reviewsResult = await getMyReviews({ page: 1, limit: 1 });
    } else if (activeTab === "pending") {
      pendingResult = await getMyBookings({ status: "PENDING", page, limit });
      upcomingResult = await getMyBookings({
        type: "upcoming",
        status: "CONFIRMED",
        page: 1,
        limit: 1,
      });
      pastResult = await getMyBookings({
        type: "past",
        status: "COMPLETED",
        page: 1,
        limit: 1,
      });
      wishlistResult = await getMyWishlist({ page: 1, limit: 1 });
      reviewsResult = await getMyReviews({ page: 1, limit: 1 });
    } else if (activeTab === "past") {
      pastResult = await getMyBookings({
        type: "past",
        status: "COMPLETED",
        page,
        limit,
      });
      upcomingResult = await getMyBookings({
        type: "upcoming",
        status: "CONFIRMED",
        page: 1,
        limit: 1,
      });
      pendingResult = await getMyBookings({
        status: "PENDING",
        page: 1,
        limit: 1,
      });
      wishlistResult = await getMyWishlist({ page: 1, limit: 1 });
      reviewsResult = await getMyReviews({ page: 1, limit: 1 });
    } else if (activeTab === "wishlist") {
      wishlistResult = await getMyWishlist({ page, limit });
      upcomingResult = await getMyBookings({
        type: "upcoming",
        status: "CONFIRMED",
        page: 1,
        limit: 1,
      });
      pendingResult = await getMyBookings({
        status: "PENDING",
        page: 1,
        limit: 1,
      });
      pastResult = await getMyBookings({
        type: "past",
        status: "COMPLETED",
        page: 1,
        limit: 1,
      });
      reviewsResult = await getMyReviews({ page: 1, limit: 1 });
    } else if (activeTab === "reviews") {
      reviewsResult = await getMyReviews({ page, limit });
      upcomingResult = await getMyBookings({
        type: "upcoming",
        status: "CONFIRMED",
        page: 1,
        limit: 1,
      });
      pendingResult = await getMyBookings({
        status: "PENDING",
        page: 1,
        limit: 1,
      });
      pastResult = await getMyBookings({
        type: "past",
        status: "COMPLETED",
        page: 1,
        limit: 1,
      });
      wishlistResult = await getMyWishlist({ page: 1, limit: 1 });
    } else {
      // Default: fetch all with default pagination
      const [up, pend, past, wish, rev] = await Promise.all([
        getMyBookings({
          type: "upcoming",
          status: "CONFIRMED",
          page: 1,
          limit: 10,
        }),
        getMyBookings({ status: "PENDING", page: 1, limit: 10 }),
        getMyBookings({
          type: "past",
          status: "COMPLETED",
          page: 1,
          limit: 10,
        }),
        getMyWishlist({ page: 1, limit: 10 }),
        getMyReviews({ page: 1, limit: 5 }),
      ]);
      upcomingResult = up;
      pendingResult = pend;
      pastResult = past;
      wishlistResult = wish;
      reviewsResult = rev;
    }

    // Process bookings - updated to match booking service response format
    const upcomingBookings: Booking[] =
      upcomingResult?.success && upcomingResult.data
        ? (upcomingResult.data.data || []).map(transformBooking)
        : [];
    const upcomingBookingsTotal = upcomingResult?.success
      ? upcomingResult.data?.meta?.total || 0
      : 0;
    const upcomingBookingsTotalPages = upcomingResult?.success
      ? upcomingResult.data?.meta?.totalPages || 0
      : 0;

    const pendingBookings: Booking[] =
      pendingResult?.success && pendingResult.data
        ? (pendingResult.data.data || []).map(transformBooking)
        : [];
    const pendingBookingsTotal = pendingResult?.success
      ? pendingResult.data?.meta?.total || 0
      : 0;
    const pendingBookingsTotalPages = pendingResult?.success
      ? pendingResult.data?.meta?.totalPages || 0
      : 0;

    const pastBookings: Booking[] =
      pastResult?.success && pastResult.data
        ? (pastResult.data.data || []).map(transformBooking)
        : [];
    const pastBookingsTotal = pastResult?.success
      ? pastResult.data?.meta?.total || 0
      : 0;
    const pastBookingsTotalPages = pastResult?.success
      ? pastResult.data?.meta?.totalPages || 0
      : 0;

    const wishlistItems: WishlistTableItem[] =
      wishlistResult?.success && wishlistResult.data
        ? (wishlistResult.data.data || []).map(transformWishlistItem)
        : [];
    const wishlistTotal = wishlistResult?.success
      ? wishlistResult.data?.meta?.total || 0
      : 0;
    const wishlistTotalPages = wishlistResult?.success
      ? wishlistResult.data?.meta?.totalPages || 0
      : 0;

    const reviews: TouristReview[] =
      reviewsResult?.success && reviewsResult.data
        ? reviewsResult.data.data || []
        : [];
    const reviewsTotal = reviewsResult?.success
      ? reviewsResult.data?.meta?.total || 0
      : 0;
    const reviewsTotalPages = reviewsResult?.success
      ? reviewsResult.data?.meta?.totalPages || 0
      : 0;

    // Calculate stats from total counts
    const stats = {
      upcomingTrips: upcomingBookingsTotal,
      completedTrips: pastBookingsTotal,
      wishlist: wishlistTotal,
      totalSpent: pastBookings.reduce(
        (sum, b) => sum + (b.paymentAmount || b.price),
        0
      ),
    };

    return (
      <Suspense
        fallback={
          <div className="flex min-h-screen flex-col">
            <main className="flex-1 bg-muted/30 py-8">
              <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <DashboardSkeleton />
              </div>
            </main>
          </div>
        }
      >
        <TouristDashboardClient
          upcomingBookings={upcomingBookings}
          upcomingBookingsTotal={upcomingBookingsTotal}
          upcomingBookingsTotalPages={upcomingBookingsTotalPages}
          pendingBookings={pendingBookings}
          pendingBookingsTotal={pendingBookingsTotal}
          pendingBookingsTotalPages={pendingBookingsTotalPages}
          pastBookings={pastBookings}
          pastBookingsTotal={pastBookingsTotal}
          pastBookingsTotalPages={pastBookingsTotalPages}
          wishlistItems={wishlistItems}
          wishlistTotal={wishlistTotal}
          wishlistTotalPages={wishlistTotalPages}
          reviews={reviews}
          reviewsTotal={reviewsTotal}
          reviewsTotalPages={reviewsTotalPages}
          stats={stats}
          activeTab={activeTab}
          currentPage={page}
          currentLimit={limit}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching tourist dashboard data:", error);
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-muted/30 py-8">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }
}
