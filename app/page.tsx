"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CategoryDropdown from "@/components/search/CategoryDropdown";
import PlaceAutoComplete from "@/components/search/PlaceAutoComplete";
import "./globals.css";
import { useRouter } from "next/navigation";
import { getLocations } from "@/api/locationApi";
import { Location } from "@/types/location";
import { useAuth } from "@/hooks/useAuth";
import { authServerInfo } from "@/lib/auth";

export interface SelectedPlace {
  full_address: string | null;
  main_text: string | null;
  secondary_text: string | null;
  description: string | null;
  place_id: string | null;
  lat: string | null;
  lng: string | null;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [featuredLocations, setFeaturedLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null
  );
  const [selectedPlaceErrorMessage, setSelectedPlaceErrorMessage] =
    useState("");
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    { type: "category" | "provider"; value: string }[]
  >([]);

  const [initialTextValue, setInitialTextValue] = useState("");
  const router = useRouter();
  const { isLoggedIn, handleLogin, handleRegister, handleLogout, user } =
    useAuth();

  // Simulate fetching featured locations
  useEffect(() => {
    const fetchFeaturedLocations = async () => {
      setIsLoading(true);
      try {
        // Get featured locations (first page, limit 6)
        const response = await getLocations({
          page: Math.floor(Math.random() * 1534),
          limit: 6,
        });
        if (response && response.data) {
          setFeaturedLocations(response.data);
        }
      } catch (error) {
        console.error("Error fetching featured locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedLocations();
  }, []);


  return (
    <div className="min-h-screen">
      <div className="py-20">
        <div className="container mx-auto px-4 space-y-16 sm:space-y-32">
          <div className="relative bg-gradient-to-r bg-slate-200 rounded-3xl p-4 sm:p-8 lg:p-16">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                Find Your Local Support Services
              </h3>
              <p className="text-lg sm:text-xl text-primary-foreground mb-8">
                Discover providers near you with comprehensive data to help you
                make informed decisions.
              </p>

              {/* Search Box */}
              <div className="bg-white p-3 rounded-lg shadow-lg flex flex-col gap-2">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-grow">
                    <CategoryDropdown
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                      onInputChange={(val) => setSearchTerm(val)} // add this

                    />
                  </div>
                  <div className="relative flex-grow">
                    <PlaceAutoComplete
                      searchType={["(cities)"]}
                      setselectedplace={setSelectedPlace}
                      placeholder="Search places"
                      selectedPlaceErrorMessage={selectedPlaceErrorMessage}
                      setInitialTextValue={setInitialTextValue}
                    />
                  </div>
                  <Button
                    className="py-3 px-6 md:px-8"
                    onClick={() => {
                      const searchParams = new URLSearchParams();

                      const hasPlace = selectedPlace?.full_address?.length;
                      const hasCategory = selectedItems.length > 0;
                      const hasTypedText = searchTerm.trim().length > 0;

                      if (!hasPlace && !hasCategory && !hasTypedText) {
                        setGeneralErrorMessage("Please fill at least one field to search");
                        return;
                      }

                      if (hasTypedText && !hasCategory) {
                        searchParams.set("title", searchTerm.trim());
                      }


                      // Clear error messages
                      setGeneralErrorMessage("");
                      setSelectedPlaceErrorMessage("");

                      // Add place to search params if exists
                      if (hasPlace) {
                        searchParams.append("search", selectedPlace.full_address || "");
                      }

                      // Add category or provider to search params if exists
                      if (hasCategory) {
                        const selected = selectedItems[0];
                        if (selected.type === "category") {
                          searchParams.set("categories", selected.value);
                        } else if (selected.type === "provider") {
                          searchParams.set("title", selected.value);
                        }
                      }

                      // Add region if exists
                      if (selectedRegion) {
                        searchParams.append("region", selectedRegion);
                      }

                      const queryString = searchParams.toString();
                      if (queryString) {
                        router.push(`/listing?${queryString}`);
                      } else {
                        router.push("/listing");
                      }
                    }}
                  >
                    Search
                  </Button>
                </div>

                {/* Error message below the input boxes */}
                {generalErrorMessage && (
                  <div className="text-red-600 text-sm px-2">
                    {generalErrorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroSection />

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-[#E8F7F1] p-6 sm:p-12 rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* Right Image */}
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900"
                  alt="Job Opportunities"
                  width={800}
                  height={600}
                  className="rounded-2xl shadow-xl w-full object-cover"
                />
              </div>


              {/* Left Content */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
                  Find Local Jobs That Match Your Skills
                </h3>
                <p className="text-lg sm:text-xl text-primary-foreground/85 mb-6">
                  Explore job opportunities from trusted Nearheal providers and
                  grow your career with confidence.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    className="bg-primary text-white h-10 min-w-[180px] px-6 flex items-center justify-center"
                  >
                    <Link
                      href={`${process.env.NEXT_PUBLIC_JOB_FRONTEND_URL}`}
                      target="_blank"
                      className="flex items-center gap-2">
                      Browse Jobs
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-10 min-w-[180px] px-6 flex items-center justify-center"
                  >
                    <Link
                      href={`${process.env.NEXT_PUBLIC_JOB_ADMIN_DASHBOARD_URL}`}
                      target="_blank"
                    >
                      Post a Job
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership & Provider Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 space-y-16 sm:space-y-32">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="relative bg-amber-200 p-6 sm:p-12 lg:p-16 py-16 sm:py-20 lg:py-24">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-6 sm:mb-8">
                  Join the Nearheal Community
                </h3>
                <p className="text-base sm:text-lg text-primary-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
                  Connect with healthcare providers and members in your
                  community
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-2xl mx-auto">
                  {/* Become a Member Button */}
                  <div className="w-full sm:w-auto sm:flex-1">
                    <Button
                      asChild
                      size="lg"
                      className="w-full cursor-pointer bg-primary text-white hover:bg-primary/90 px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleLogin}
                    >
                      <div className="flex items-center justify-center gap-3 py-1">
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="whitespace-nowrap">
                          Become a Member
                        </span>
                      </div>
                    </Button>
                  </div>

                  {/* Join as Provider Button */}
                  <div className="w-full sm:w-auto sm:flex-1">
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full cursor-pointer bg-white text-slate-700  hover:bg-slate-50 px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => {
                        window.location.href = `${process.env.NEXT_PUBLIC_NEARHEAL_LOCATION_ADMIN_URL}`;
                      }}
                    >
                      <div className="flex items-center justify-center gap-3 py-1">
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-2 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                          />
                        </svg>
                        <span className="whitespace-nowrap">
                          Join as a Provider
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Services with Location Search */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 space-y-16 sm:space-y-32">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="relative bg-[#FDE1D3]/80 p-4 sm:p-8 lg:p-16">
              <div className="max-w-4xl mx-auto">
                {/* Featured Locations */}
                <div className="mt-12 sm:mt-16">
                  <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-6 text-center">
                    Featured Providers
                  </h4>

                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredLocations && featuredLocations.length > 0 ? (
                        featuredLocations.map((location) => (
                          <div
                            key={location.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="h-40 overflow-hidden">
                              <Image
                                src={
                                  location.gallery &&
                                    location.gallery.length > 0
                                    ? location.gallery[0]
                                    : "/images/location-placeholder.jpg"
                                }
                                alt={location.title}
                                width={400}
                                height={160}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex items-center justify-between space-x-1 mb-2">
                                {location.categories &&
                                  location.categories.length > 0 && (
                                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                                      {location.categories[0]}
                                    </span>
                                  )}
                                <div className="flex items-center ml-2">
                                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                  <span className="text-xs ml-1">
                                    {location.claimStatus}
                                  </span>
                                </div>
                              </div>
                              <h3 className="text-lg font-bold mb-2">
                                {location.title}
                              </h3>
                              <div className="flex items-center text-muted-foreground mb-2">
                                <MapPin className="h-4 w-4 flex-shrink-0 mr-1" />
                                <span className="text-sm truncate">
                                  {location.location}
                                </span>
                              </div>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {location.description &&
                                  location.description.length > 80
                                  ? `${location.description.substring(
                                    0,
                                    80
                                  )}...`
                                  : location.description}
                              </p>
                              <Link
                                href={`/listing/${location.slug}`}
                                className="text-primary hover:text-primary/80 font-medium flex items-center text-sm mt-2"
                              >
                                View Details
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <p>No featured locations available at the moment.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show all button */}
                  <div className="flex justify-center mt-8">
                    <Button asChild>
                      <Link
                        href="/listing"
                        className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-base sm:text-lg"
                      >
                        View All Providers
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <ServicesSection />
    </div>
  );
}
