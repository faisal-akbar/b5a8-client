"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/useDebounce";
import type { GuideListing } from "@/types/guide";
import type { CategoryData } from "@/types/profile";
import { motion } from "framer-motion";
import { Clock, DollarSign, Filter, Globe, MapPin, Search, Sparkles, Star, Tag, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Chinese",
];

type ExploreFilters = {
  searchTerm?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
};

type ExploreClientProps = {
  initialListings: GuideListing[];
  initialMeta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialFilters: ExploreFilters;
  initialCategories: CategoryData[];
  initialFeaturedCities: Array<{
    city: string;
    listingsCount?: number;
    image?: string | null;
  }>;
};

/**
 * Client component for explore page with interactive filtering
 */
export function ExploreClient({
  initialListings,
  initialMeta,
  initialFilters,
  initialCategories,
  initialFeaturedCities,
}: ExploreClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for form inputs
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(
    initialFilters.searchTerm || ""
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.minPrice || 0,
    initialFilters.maxPrice || 1000,
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialFilters.category
  );
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    initialFilters.city
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    initialFilters.language
  );

  // Debounce search input to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  /**
   * Update URL when debounced search term changes
   */
  useEffect(() => {
    updateFilters({
      searchTerm: debouncedSearchTerm || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  /**
   * Update URL with new filters
   */
  const updateFilters = (updates: Partial<ExploreFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update each filter parameter
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.set("page", "1");

    startTransition(() => {
      router.push(`/explore?${params.toString()}`);
    });
  };

  /**
   * Handle search input change (local state only, debounced update to URL)
   */
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  /**
   * Handle price range change (debounced via button)
   */
  const handlePriceChange = () => {
    updateFilters({
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    });
  };

  /**
   * Handle category change
   */
  const handleCategoryChange = (category: string) => {
    const newCategory = category === selectedCategory ? undefined : category;
    setSelectedCategory(newCategory);
    updateFilters({ category: newCategory });
  };

  /**
   * Handle city change
   */
  const handleCityChange = (city: string) => {
    const newCity = city === selectedCity ? undefined : city;
    setSelectedCity(newCity);
    updateFilters({ city: newCity });
  };

  /**
   * Handle language change
   */
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    updateFilters({ language });
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setSearchInput("");
    setPriceRange([0, 1000]);
    setSelectedCategory(undefined);
    setSelectedCity(undefined);
    setSelectedLanguage(undefined);

    startTransition(() => {
      router.push("/explore");
    });
  };

  /**
   * Handle pagination with limit
   */
  const handlePageChange = (page: number, limit?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    if (limit !== undefined) {
      params.set("limit", String(limit));
    }

    startTransition(() => {
      router.push(`/explore?${params.toString()}`);
    });
  };

  // Check if any filters are active
  const hasActiveFilters = !!(
    debouncedSearchTerm ||
    selectedCategory ||
    selectedCity ||
    selectedLanguage ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000
  );

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Search Header */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-12 lg:py-16">
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Explore <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Tours</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
                Discover unique experiences with local experts around the world.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
                <Input
                  placeholder="Search tours, cities, descriptions..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="group h-14 border-2 border-border/50 bg-background/50 pl-12 text-base font-medium shadow-lg backdrop-blur-sm transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-primary/30"
                />
              </div>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-2 border-border/50 bg-background/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:scale-105 sm:w-auto lg:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Filters Sidebar */}
              <aside
                className={`w-full space-y-6 lg:w-80 lg:shrink-0 ${
                  showMobileFilters ? "block" : "hidden lg:block"
                }`}
              >
                <div className="sticky top-24">
                  <Card className="relative overflow-hidden border-2 border-primary/20 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-2xl">
                    {/* Decorative gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                    
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Filter className="h-4 w-4 text-primary" />
                          </div>
                          <h2 className="text-lg font-bold text-foreground">
                            Filters
                          </h2>
                        </div>
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="text-primary transition-all duration-300 hover:text-primary/80 hover:scale-105"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Clear all
                          </Button>
                        )}
                      </div>

                      {/* Price Range */}
                      <div className="mt-6 space-y-4 rounded-lg border border-border/50 bg-muted/20 p-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <Label className="font-semibold">Price Range</Label>
                        </div>
                        <div className="space-y-4">
                          <Slider
                            value={priceRange}
                            onValueChange={(value) =>
                              setPriceRange(value as [number, number])
                            }
                            min={0}
                            max={1000}
                            step={10}
                            className="w-full"
                          />
                          <div className="flex items-center justify-between">
                            <div className="rounded-lg bg-background px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm">
                              ${priceRange[0]}
                            </div>
                            <div className="h-px flex-1 bg-border mx-2" />
                            <div className="rounded-lg bg-background px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm">
                              ${priceRange[1]}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={handlePriceChange}
                            disabled={isPending}
                            className="w-full shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            Apply Price Filter
                          </Button>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <Label className="font-semibold">Category</Label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {initialCategories.length > 0 &&
                            initialCategories.map((category, index) => {
                              const gradients = [
                                "from-blue-500 to-cyan-500",
                                "from-purple-500 to-pink-500",
                                "from-orange-500 to-red-500",
                                "from-green-500 to-emerald-500",
                                "from-amber-500 to-yellow-500",
                                "from-rose-500 to-pink-500",
                                "from-indigo-500 to-purple-500",
                                "from-teal-500 to-cyan-500"
                              ];
                              const gradient = gradients[index % gradients.length];
                              const isSelected = selectedCategory === category.category;
                              
                              return (
                                <Badge
                                  key={category.category}
                                  variant={isSelected ? "default" : "outline"}
                                  className={`group/cat relative cursor-pointer overflow-hidden border-0 px-3 py-1.5 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                    isSelected ? '' : 'bg-muted/50'
                                  }`}
                                  onClick={() =>
                                    handleCategoryChange(category.category)
                                  }
                                >
                                  {!isSelected && (
                                    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover/cat:opacity-100`} />
                                  )}
                                  <span className={`relative transition-colors duration-300 ${
                                    isSelected ? '' : 'group-hover/cat:text-white'
                                  }`}>
                                    {category.category.charAt(0).toUpperCase() +
                                      category.category.slice(1).toLowerCase()}
                                  </span>
                                  {!isSelected && (
                                    <Sparkles className="absolute right-1 top-1 h-3 w-3 text-white opacity-0 transition-all duration-300 group-hover/cat:opacity-100" />
                                  )}
                                </Badge>
                              );
                            })}
                        </div>
                      </div>

                      {/* Featured Cities */}
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <Label className="font-semibold">Featured Cities</Label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {initialFeaturedCities.length > 0 &&
                            initialFeaturedCities.map((city) => {
                              const isSelected = selectedCity === city.city;
                              
                              return (
                                <Badge
                                  key={city.city}
                                  variant={isSelected ? "default" : "outline"}
                                  className={`group/city cursor-pointer gap-1.5 px-3 py-1.5 font-medium transition-all duration-300 hover:scale-105 hover:shadow-md ${
                                    isSelected ? '' : 'hover:border-primary/50'
                                  }`}
                                  onClick={() => handleCityChange(city.city)}
                                >
                                  <MapPin className="h-3 w-3" />
                                  {city.city}
                                  {city.listingsCount && (
                                    <span className="ml-1 text-xs opacity-70">
                                      ({city.listingsCount})
                                    </span>
                                  )}
                                </Badge>
                              );
                            })}
                        </div>
                      </div>

                      {/* Language */}
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          <Label className="font-semibold">Language</Label>
                        </div>
                        <Select
                          value={selectedLanguage || "all"}
                          onValueChange={(value) =>
                            handleLanguageChange(value === "all" ? "" : value)
                          }
                        >
                          <SelectTrigger className="w-full h-10 border-2 border-border/50 bg-background transition-all duration-300 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20">
                            <div className="flex items-center gap-2">
                              <SelectValue placeholder="All languages" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              <div className="flex items-center gap-2">
                                All languages
                              </div>
                            </SelectItem>
                            {LANGUAGES.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {initialMeta.total}
                    </span>{" "}
                    {initialMeta.total === 1 ? "tour" : "tours"} found
                  </p>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {debouncedSearchTerm && (
                      <Badge variant="secondary" className="gap-2">
                        Search: {debouncedSearchTerm}
                        <button
                          type="button"
                          aria-label="Clear search filter"
                          className="flex items-center justify-center focus:outline-none"
                          tabIndex={0}
                          onClick={() => {
                            setSearchInput("");
                            updateFilters({ searchTerm: undefined });
                          }}
                        >
                          {" "}
                          <X className="h-3 w-3 cursor-pointer" />
                        </button>
                      </Badge>
                    )}
                    {selectedCategory && (
                      <Badge variant="secondary" className="gap-2">
                        {selectedCategory.charAt(0).toUpperCase() +
                          selectedCategory.slice(1).toLowerCase()}

                        <button
                          type="button"
                          aria-label="Clear category filter"
                          className="flex items-center justify-center focus:outline-none"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedCategory(undefined);
                            updateFilters({ category: undefined });
                          }}
                        >
                          {" "}
                          <X className="h-3 w-3 cursor-pointer" />
                        </button>
                      </Badge>
                    )}
                    {selectedCity && (
                      <Badge variant="secondary" className="gap-2">
                        <MapPin className="h-3 w-3" />
                        {selectedCity}
                        <button
                          type="button"
                          aria-label="Clear city filter"
                          className="flex items-center justify-center focus:outline-none"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedCity(undefined);
                            updateFilters({ city: undefined });
                          }}
                        >
                          <X className="h-3 w-3 cursor-pointer" />
                        </button>
                      </Badge>
                    )}
                    {selectedLanguage && (
                      <Badge variant="secondary" className="gap-2">
                        {selectedLanguage}
                        <button
                          type="button"
                          aria-label="Clear language filter"
                          className="flex items-center justify-center focus:outline-none"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedLanguage(undefined);
                            updateFilters({ language: undefined });
                          }}
                        >
                          <X className="h-3 w-3 cursor-pointer" />
                        </button>
                      </Badge>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                      <Badge variant="secondary" className="gap-2">
                        ${priceRange[0]} - ${priceRange[1]}
                        <button
                          type="button"
                          aria-label="Clear price filter"
                          className="flex items-center justify-center focus:outline-none"
                          tabIndex={0}
                          onClick={() => {
                            setPriceRange([0, 1000]);
                            updateFilters({
                              minPrice: undefined,
                              maxPrice: undefined,
                            });
                          }}
                        >
                          <X className="h-3 w-3 cursor-pointer" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Tour Cards */}
                {isPending ? (
                  <div className="mt-6 grid gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-64 animate-pulse rounded bg-muted"
                      />
                    ))}
                  </div>
                ) : initialListings.length === 0 ? (
                  <div className="mt-12 flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-6">
                      <Search className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-foreground">
                      No tours found
                    </h3>
                    <p className="mt-2 text-center text-muted-foreground">
                      Try adjusting your filters or search terms to find what
                      you're looking for.
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={handleClearFilters} className="mt-6">
                        Clear all filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 grid gap-6">
                    {initialListings.map((listing, index) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link href={`/tours/${listing.id}`}>
                          <Card className="py-0 group relative cursor-pointer overflow-hidden border-2 border-border/50 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl">
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="flex flex-col sm:flex-row">
                              <div className="relative h-64 overflow-hidden sm:h-auto sm:w-80">
                                <Image
                                  src={listing.images[0]}
                                  alt={listing.title}
                                  fill
                                  className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                                  unoptimized={listing.images[0]?.startsWith(
                                    "http"
                                  )}
                                />
                                {/* Image overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <Badge className="absolute right-3 top-3 border-0 bg-background/95 font-semibold text-foreground shadow-lg backdrop-blur-md ring-1 ring-primary/10 transition-all duration-300 hover:bg-background/95 hover:scale-105">
                                  {listing.category.charAt(0).toUpperCase() +
                                    listing.category.slice(1).toLowerCase()}
                                </Badge>
                                {!listing.isActive && (
                                  <Badge
                                    variant="destructive"
                                    className="absolute left-3 top-3"
                                  >
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="relative flex flex-1 flex-col p-6">
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h3 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                                        {listing.title}
                                      </h3>
                                      <p className="mt-1 text-sm text-muted-foreground">
                                        by{" "}
                                        {listing.guide?.user?.name ||
                                          "Local Guide"}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="relative inline-block">
                                        {/* Price glow effect */}
                                        <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
                                        <div className="relative rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 px-4 py-2 shadow-sm ring-1 ring-primary/20">
                                          <div className="text-2xl font-bold text-primary">
                                            ${listing.tourFee}
                                          </div>
                                          <div className="text-xs font-medium text-muted-foreground">
                                            per person
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-sm font-medium transition-colors duration-300 group-hover:bg-muted w-fit">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="text-foreground">
                                      {listing.city}
                                    </span>
                                  </div>

                                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                                    {listing.description}
                                  </p>

                                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                                    {listing.averageRating && (
                                      <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-3 py-1.5 ring-1 ring-amber-500/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
                                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                        <span className="font-bold text-amber-600 dark:text-amber-400">
                                          {listing.averageRating.toFixed(1)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          ({listing._count.reviews})
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1.5 rounded-lg bg-muted/80 px-3 py-1.5 font-medium transition-all duration-300 hover:bg-muted hover:scale-105">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span className="text-foreground">
                                        {listing.durationDays}{" "}
                                        {listing.durationDays === 1
                                          ? "day"
                                          : "days"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-lg bg-muted/80 px-3 py-1.5 font-medium transition-all duration-300 hover:bg-muted hover:scale-105">
                                      <Users className="h-4 w-4 text-primary" />
                                      <span className="text-foreground">Up to {listing.maxGroupSize}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {initialMeta.totalPages > 0 && (
                  <div className="mt-12 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {initialMeta.total} total
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Page</p>
                        <Select
                          value={`${initialMeta.page}`}
                          onValueChange={(value) => {
                            handlePageChange(Number(value), initialMeta.limit);
                          }}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={initialMeta.page} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {Array.from(
                              { length: initialMeta.totalPages },
                              (_, i) => i + 1
                            ).map((pageNum) => (
                              <SelectItem key={pageNum} value={`${pageNum}`}>
                                {pageNum}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                          of {initialMeta.totalPages}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                          value={`${initialMeta.limit}`}
                          onValueChange={(value) => {
                            handlePageChange(1, Number(value)); // Reset to page 1 when limit changes
                          }}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={initialMeta.limit} />
                          </SelectTrigger>
                          <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                              <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
