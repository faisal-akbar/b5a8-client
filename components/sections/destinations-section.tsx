import { Card } from "@/components/ui/card";
import { getFeaturedCities } from "@/services/listing/listing.service";
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
                <Card className="group cursor-pointer overflow-hidden border-0 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.city}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width={100}
                      height={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                    <div className="absolute bottom-0 left-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                      <h3 className="text-2xl font-bold tracking-tight">
                        {destination.city}
                      </h3>
                      {destination.listingsCount !== undefined && (
                        <div className="mt-3 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-md">
                          {destination.listingsCount}{" "}
                          {destination.listingsCount === 1 ? "tour" : "tours"}{" "}
                          available
                        </div>
                      )}
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
