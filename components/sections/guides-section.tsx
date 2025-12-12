import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTopRatedGuides } from "@/services/user/user.service";
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Star } from "lucide-react";
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
                <Card className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50">
                  {/* Subtle gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  <CardContent className="relative p-6">
                    {/* Profile Image Container with Enhanced Effects */}
                    <div className="relative mx-auto h-32 w-32">
                      {/* Animated glow ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/40 via-primary/20 to-transparent opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:scale-110" />
                      
                      {/* Main profile image */}
                      <div className="relative h-full w-full overflow-hidden rounded-full ring-4 ring-background shadow-xl transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-2xl">
                        {guide.profilePic ? (
                          <Image
                            src={guide.profilePic}
                            alt={guide.name}
                            width={300}
                            height={300}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-125"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-full">
                            <span className="text-primary text-4xl font-bold">
                              {guide.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        
                        {/* Verified badge for top guides */}
                        <div className="absolute top-0 right-0 translate-x-1 -translate-y-1">
                          <div className="rounded-full bg-primary p-1.5 shadow-lg ring-4 ring-background">
                            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced rating badge */}
                      {guide.averageRating > 0 && (
                        <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-sm font-bold shadow-lg ring-2 ring-background transition-transform duration-300 group-hover:scale-110">
                          <Star className="mr-1 h-3.5 w-3.5 fill-white" />
                          {guide.averageRating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Guide Info */}
                    <div className="mt-6 text-center">
                      <h3 className="font-bold text-lg text-foreground transition-colors duration-300 group-hover:text-primary">
                        {guide.name}
                      </h3>
                      
                      {/* Stats with icons */}
                      <div className="mt-4 flex items-center justify-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 font-medium text-muted-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>
                            {guide.totalReviews}{" "}
                            {guide.totalReviews === 1 ? "review" : "reviews"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 font-medium text-muted-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>
                            {guide.totalListings}{" "}
                            {guide.totalListings === 1 ? "tour" : "tours"}
                          </span>
                        </div>
                      </div>
                      
                      {/* View Profile CTA */}
                      <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-3">
                        <span>View Profile</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
