import { getUserById } from "@/services/user/user.service"
import { notFound } from "next/navigation"
import { PublicProfileClient } from "./public-profile-client"
import { getReviewsByGuideId } from "@/services/review"

export const dynamic = "force-dynamic"

interface ProfilePageProps {
  params: {
    id: string
  }
  searchParams: {
    page?: string
    limit?: string
  }
}

export default async function PublicProfilePage({ params, searchParams }: ProfilePageProps) {
  const { id } = await params
  const resolvedSearchParams = await searchParams

  // Parse pagination params from URL
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1
  const limit = resolvedSearchParams.limit ? parseInt(resolvedSearchParams.limit) : 10

  // Fetch user data by ID
  const [userResult, reviewsResult] = await Promise.all([
    getUserById(id),
    getReviewsByGuideId(id, { page, limit }),
  ])

  if (!userResult.success || !userResult.data) {
    notFound()
  }

  const userData = userResult.data

  return <PublicProfileClient userData={userData} reviewsData={reviewsResult} />
}
