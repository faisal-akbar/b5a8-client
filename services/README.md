# Services Documentation

This directory contains all server actions for interacting with the Local Guide API backend. All services are implemented as server actions (using `"use server"` directive) and can be used directly in Server Components, Server Actions, and Route Handlers.

## Service Structure

All services follow a consistent pattern:
- Located in `services/{module}/`
- Export TypeScript interfaces for parameters
- Return objects with `success`, `data`, and `message` properties
- Handle errors gracefully with user-friendly messages

## Available Services

### Authentication (`services/auth/`)

- **`registerUser`** - Register a new user (Tourist or Guide)
- **`loginUser`** - Login with email and password
- **`logoutUser`** - Logout and clear tokens
- **`getUserInfo`** - Get current user information
- **`getNewAccessToken`** - Refresh access token using refresh token
- **`forgotPassword`** - Send password reset email
- **`changePassword`** - Change password (requires old password)
- **`resetPassword`** - Reset password (after forgot password flow)

### User Management (`services/user/`)

- **`getMyProfile`** - Get current user's profile
- **`getUserById`** - Get public user profile by ID
- **`getTopRatedGuides`** - Get top rated guides (public)
- **`getAllUsers`** - Get all users (Admin only)
- **`updateUser`** - Update user profile
- **`blockUser`** - Block/unblock user (Admin only)
- **`createAdmin`** - Create admin user (Admin only)

### Listings (`services/listing/`)

- **`getAllListings`** - Get all listings with filters (city, category, price, etc.)
- **`getListingById`** - Get listing details by ID
- **`getFeaturedCities`** - Get featured cities
- **`getMyListings`** - Get current guide's listings
- **`createListing`** - Create a new listing (Guide only)
- **`updateListing`** - Update listing (Guide only)
- **`deleteListing`** - Delete listing (Guide only)

### Bookings (`services/booking/`)

- **`createBooking`** - Create a booking (Tourist only)
- **`getMyBookings`** - Get user's bookings (Tourist or Guide)
- **`getAllBookings`** - Get all bookings (Admin only)
- **`getBookingById`** - Get booking details by ID
- **`updateBookingStatus`** - Update booking status (Guide or Admin)

### Reviews (`services/review/`)

- **`getReviews`** - Get all reviews (with optional listing filter)
- **`getReviewById`** - Get review by ID
- **`createReview`** - Create a review (Tourist only)
- **`updateReview`** - Update review (Tourist or Admin)
- **`deleteReview`** - Delete review (Tourist or Admin)

### Payments (`services/payment/`)

- **`confirmPayment`** - Confirm payment with payment intent ID (Tourist only)
- **`getPayments`** - Get user's payments
- **`getPaymentByBookingId`** - Get payment by booking ID
- **`getPaymentById`** - Get payment by ID
- **`releasePaymentToGuide`** - Release payment to guide (Guide or Admin)

### Availabilities (`services/availability/`)

- **`getAvailabilities`** - Get all availabilities (with optional listing filter)
- **`getAvailabilityById`** - Get availability by ID
- **`getMyAvailabilities`** - Get guide's availabilities
- **`createAvailability`** - Create availability (Guide only)
- **`createBulkAvailability`** - Create multiple availabilities (Guide only)
- **`updateAvailability`** - Update availability (Guide only)
- **`deleteAvailability`** - Delete availability (Guide only)

### Wishlist (`services/wishlist/`)

- **`addToWishlist`** - Add listing to wishlist (Tourist only)
- **`getMyWishlist`** - Get user's wishlist (Tourist only)
- **`checkWishlistStatus`** - Check if listing is in wishlist (Tourist only)
- **`removeFromWishlist`** - Remove listing from wishlist (Tourist only)

### Badges (`services/badge/`)

- **`getGuideBadges`** - Get badges for a guide (public)
- **`recalculateGuideBadges`** - Recalculate badges for a guide (Admin only)
- **`recalculateAllBadges`** - Recalculate all badges (Admin only)

### Stats (`services/stats/`)

All stats endpoints are Admin only:

- **`getOverviewStats`** - Get overview statistics
- **`getUserStats`** - Get user statistics
- **`getTouristStats`** - Get tourist statistics
- **`getGuideStats`** - Get guide statistics
- **`getListingStats`** - Get listing statistics
- **`getBookingStats`** - Get booking statistics
- **`getRevenueStats`** - Get revenue statistics
- **`getProfitStats`** - Get profit statistics

### OTP (`services/otp/`)

- **`sendOTP`** - Send OTP to email
- **`verifyOTP`** - Verify OTP code

## Usage Examples

### In Server Components

```typescript
import { getAllListings } from "@/services/listing";
import { getMyProfile } from "@/services/user";

export default async function ListingsPage() {
  const listingsResult = await getAllListings({ page: 1, limit: 10 });
  
  if (!listingsResult.success) {
    return <div>Error: {listingsResult.message}</div>;
  }
  
  return (
    <div>
      {listingsResult.data.map(listing => (
        <div key={listing.id}>{listing.title}</div>
      ))}
    </div>
  );
}
```

### In Server Actions

```typescript
"use server";

import { createBooking } from "@/services/booking";
import { revalidatePath } from "next/cache";

export async function handleBooking(formData: FormData) {
  const listingId = formData.get("listingId") as string;
  const date = formData.get("date") as string;
  
  const result = await createBooking({ listingId, date });
  
  if (result.success) {
    revalidatePath("/dashboard");
    return { success: true, message: "Booking created successfully" };
  }
  
  return { success: false, message: result.message };
}
```

### In Client Components (via Server Actions)

```typescript
"use client";

import { addToWishlist } from "@/services/wishlist";
import { useState } from "react";

export function WishlistButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);
  
  async function handleAddToWishlist() {
    setLoading(true);
    const result = await addToWishlist({ listingId });
    setLoading(false);
    
    if (result.success) {
      alert("Added to wishlist!");
    } else {
      alert(result.message);
    }
  }
  
  return (
    <button onClick={handleAddToWishlist} disabled={loading}>
      Add to Wishlist
    </button>
  );
}
```

## Error Handling

All services return a consistent response format:

```typescript
{
  success: boolean;
  data?: any;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}
```

Always check the `success` property before using `data`:

```typescript
const result = await getAllListings();

if (result.success) {
  // Use result.data safely
  console.log(result.data);
} else {
  // Handle error
  console.error(result.message);
}
```

## Type Safety

All services export TypeScript interfaces for their parameters:

```typescript
import type { CreateBookingParams, GetMyBookingsParams } from "@/services/booking";

const bookingParams: CreateBookingParams = {
  listingId: "123",
  date: "2025-01-15T09:00:00.000Z",
};

const result = await createBooking(bookingParams);
```

## Notes

- All services automatically handle token refresh via `serverFetch`
- Services use cookies for authentication (httpOnly, secure)
- FormData is used for endpoints that accept file uploads
- All date/time parameters should be ISO 8601 strings
- Pagination parameters (page, limit) are optional with sensible defaults

