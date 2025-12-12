"use server";

import { Card, CardContent } from "@/components/ui/card";
import { getReviews } from "@/services/review/review.service";
import type { GuideReview } from "@/types/guide";
import { Star } from "lucide-react";
import Image from "next/image";

type Testimonial = {
  id?: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  tour: string;
  image: string | null;
};

async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    // Fetch recent reviews (limit to 6 for display)
    const result = await getReviews({ page: 1, limit: 6 });

    if (!result.success || !result.data) {
      return getDefaultTestimonials();
    }

    const reviews = Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.data?.data)
      ? result.data.data
      : [];

    if (reviews.length === 0) {
      return getDefaultTestimonials();
    }

    // Transform reviews to testimonials format
    return reviews
      .filter(
        (review: GuideReview) =>
          review.comment && review.comment.trim().length > 0
      )
      .slice(0, 6)
      .map((review: GuideReview) => ({
        id: review.id,
        name: review.tourist?.user?.name || "Anonymous Traveler",
        location: "Traveler", // API doesn't provide location, using generic
        rating: review.rating || 5,
        comment: review.comment || "",
        tour: review.listing?.title || "Tour Experience",
        image: review.tourist?.user?.profilePic || null,
      }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return getDefaultTestimonials();
  }
}

function getDefaultTestimonials(): Testimonial[] {
  return [
    {
      name: "Sarah Johnson",
      location: "USA",
      rating: 5,
      comment:
        "Marco showed us hidden spots in Rome we never would have found on our own. Absolutely incredible experience!",
      tour: "Hidden Rome Food Tour",
      image: "/woman-traveler.png",
    },
    {
      name: "David Chen",
      location: "Singapore",
      rating: 5,
      comment:
        "Sophie made Paris magical! Her photography tips and local insights were invaluable. Highly recommend!",
      tour: "Paris Photography Walk",
      image: "/asian-man-traveler.jpg",
    },
    {
      name: "Emma Wilson",
      location: "UK",
      rating: 5,
      comment:
        "Yuki took us to the best local restaurants in Tokyo. This was the highlight of our entire trip!",
      tour: "Tokyo Night Food Adventure",
      image: "/british-woman-traveler.jpg",
    },
  ];
}

export async function TestimonialsSection() {
  const testimonials = await fetchTestimonials();

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Travelers Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real experiences from real travelers
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id || `testimonial-${index}`}
              className="h-full transition-shadow hover:shadow-md"
            >
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex gap-1 text-primary mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed italic grow">
                  "{testimonial.comment}"
                </p>
                <div className="mt-8 flex items-center gap-4 pt-6 border-t">
                  {testimonial.image ? (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/10">
                      <span className="text-primary font-semibold text-lg">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground font-medium text-right">
                  Tour: {testimonial.tour}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
