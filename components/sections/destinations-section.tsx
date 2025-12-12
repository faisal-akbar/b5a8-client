import { Card } from "@/components/ui/card";
import { getFeaturedCities } from "@/services/listing/listing.service";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type FeaturedCity = {
  city: string;
  listingsCount?: number;
  image?: string | null;
};

export async function DestinationsSection() {
  const featuredCitiesResult = await getFeaturedCities();

  const featuredCities: FeaturedCity[] =
    featuredCitiesResult.success && featuredCitiesResult.data
      ? featuredCitiesResult.data.slice(0, 6)
      : [];

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Popular Destinations
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore the world's most exciting cities
          </p>
        </div>

        {featuredCities.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCities.map((destination) => (
              <Link
                key={destination.city}
                href={`/explore?city=${destination.city}`}
              >
                <Card className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 py-0">
                  <div className="relative h-80 overflow-hidden">
                    {/* Image with enhanced zoom effect */}
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.city}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                      width={500}
                      height={400}
                      priority
                    />
                    
                    {/* Enhanced gradient overlay with multiple layers */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/95" />
                    
                    {/* Subtle top gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
                    
                    {/* Animated accent gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    {/* Content container with improved spacing */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      {/* Top badge with icon */}
                      {destination.listingsCount !== undefined && (
                        <div className="flex justify-end">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-xl ring-1 ring-white/20 transition-all duration-300 group-hover:bg-white/25 group-hover:scale-105">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>
                              {destination.listingsCount}{" "}
                              {destination.listingsCount === 1 ? "tour" : "tours"}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Bottom content with enhanced typography */}
                      <div className="space-y-3 transform transition-all duration-300 group-hover:translate-y-[-8px]">
                        <h3 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
                          {destination.city}
                        </h3>
                        
                        {/* Explore CTA with arrow icon */}
                        <div className="flex items-center gap-2 text-white/90 transition-all duration-300 group-hover:gap-3 group-hover:text-white">
                          <span className="text-sm font-medium tracking-wide">
                            Explore destination
                          </span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                        
                        {/* Animated underline */}
                        <div className="h-0.5 w-0 bg-gradient-to-r from-white to-white/50 transition-all duration-500 group-hover:w-24" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-muted-foreground">
            <p>No featured destinations available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
