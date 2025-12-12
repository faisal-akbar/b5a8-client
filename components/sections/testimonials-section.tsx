"use server";

import { Card, CardContent } from "@/components/ui/card";
import { getReviews } from "@/services/review/review.service";
import type { GuideReview } from "@/types/guide";
import { CheckCircle2, MapPin, Quote, Sparkles, Star } from "lucide-react";
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
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-muted/30 py-16 lg:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute right-1/3 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Customer Stories</span>
          </div>
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
              className="group relative h-full overflow-hidden border-2 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Gradient background overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Decorative quote icon */}
              <div className="absolute -top-2 -right-2 opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110">
                <Quote className="h-24 w-24 text-primary" />
              </div>
              
              <CardContent className="relative flex flex-col h-full p-8">
                {/* Rating with enhanced styling */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="relative">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400 transition-transform duration-300 group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Verified badge */}
                  <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Verified</span>
                  </div>
                </div>
                
                {/* Quote text with better styling */}
                <div className="relative grow">
                  <Quote className="absolute -left-2 -top-2 h-8 w-8 text-primary/20" />
                  <p className="relative text-foreground/90 leading-relaxed pl-6 pt-4">
                    {testimonial.comment}
                  </p>
                </div>
                
                {/* Profile section with enhanced design */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {/* Glow effect on profile image */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:scale-125" />
                      
                      {testimonial.image ? (
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="relative h-14 w-14 rounded-full object-cover ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/50 group-hover:scale-105"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/50 group-hover:scale-105">
                          <span className="text-primary font-bold text-xl">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tour info with better styling */}
                  <div className="mt-4 rounded-lg bg-muted/50 px-3 py-2 transition-colors duration-300 group-hover:bg-primary/5">
                    <p className="text-xs font-medium text-muted-foreground">
                      <span className="text-primary">Tour:</span> {testimonial.tour}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
