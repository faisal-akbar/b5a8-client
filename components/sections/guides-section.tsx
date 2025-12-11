import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTopRatedGuides } from "@/services/user/user.service";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TopRatedGuide = {
  id: string;
  name: string;
  profilePic?: string | null;
  averageRating: number;
  totalReviews: number;
  totalListings: number;
};

export async function GuidesSection() {
  const topRatedGuidesResult = await getTopRatedGuides();

  const guides: TopRatedGuide[] =
    topRatedGuidesResult.success && topRatedGuidesResult.data
      ? topRatedGuidesResult.data.slice(0, 4)
      : [];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Meet Our Top-Rated Guides
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experienced locals ready to show you around
          </p>
        </div>

        {guides.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide) => (
              <Link key={guide.id} href={`/profile/${guide.id}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full ring-4 ring-background shadow-lg">
                      {guide.profilePic ? (
                        <Image
                          src={guide.profilePic}
                          alt={guide.name}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center rounded-full">
                          <span className="text-muted-foreground text-xs">
                            {guide.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {guide.averageRating > 0 && (
                        <Badge className="absolute bottom-0 right-0 bg-primary px-2 py-0.5 text-sm shadow-sm">
                          <Star className="mr-1 h-3 w-3 fill-primary-foreground" />
                          {guide.averageRating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {guide.name}
                      </h3>
                      <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded-full">
                          {guide.totalReviews}{" "}
                          {guide.totalReviews === 1 ? "review" : "reviews"}
                        </span>
                        <span className="bg-muted px-2 py-1 rounded-full">
                          {guide.totalListings}{" "}
                          {guide.totalListings === 1 ? "tour" : "tours"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-muted-foreground">
            <p>No top-rated guides available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
