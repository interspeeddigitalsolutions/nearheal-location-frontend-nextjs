"use client";

import {
  getFavoriteLocations,
  getLocationPlaceholderImage,
} from "@/api/locationApi";
import ProtectedPage from "@/components/ProtectedPageTemplete";
import FilterSidebar from "@/components/providers/FilterSidebar";
import LocationCardList from "@/components/providers/LocationCardList";
import PaginationControls from "@/components/providers/PaginationControls";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import GoogleMap from "@/components/ui/GoogleMap"; // Import your GoogleMap component
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/location";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const FavoritePage = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  // Extract search and region parameters from URL
  const searchParams = useSearchParams();
  const getInitialSearchTerm = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("search") || "";
  };

  const [initialTextValue, setInitialTextValue] = useState("");

  const getInitialRegion = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("region") || null;
  };

  const [searchTerm, setSearchTerm] = useState(getInitialSearchTerm());
  const [initialTextValueForSearchTerm, setInitialTextValueForSearchTerm] =
    useState("");

  const [filterSearchTerm, setFilterSearchTerm] = useState(
    getInitialSearchTerm()
  );
  const [clickedReset, setClickedReset] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    getInitialRegion()
  );

  const [sortBy, setSortBy] = useState("featured");

  // State for API data
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const currentPage = Number(searchParams.get("page") || 1);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  // View state for mobile (list vs map)
  const [activeView, setActiveView] = useState<"list" | "map">("list");

  // State for selected location on map
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );

  // State for mobile search input
  const [mobileSearchInput, setMobileSearchInput] = useState("");

  // State for filter drawer
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Ref for search input
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const setCurrentPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.append("page", String(page <= 1 ? 1 : page));

    router.push(`${pathname}?${params.toString()}`);
  };
  // Reset filters function
  const resetFilters = () => {
    setCurrentPage(1);
    router.push("/dashboard/favorites");
  };

  useEffect(() => {
    fetchLocations();
  }, [location.search, currentPage, user?.id]);

  // Function to fetch locations from the API
  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);

    const searchParams = new URLSearchParams(location.search);
    const newSearchTerm = searchParams.get("search") || "";
    const newRegion = searchParams.get("region") || null;
    const rawCategories = searchParams.get("categories") || null;
    const newCategories = rawCategories ? rawCategories.split(",") : [];

    try {
      // Extract price range from price filter (assuming format like "$", "$$", etc.)
      let priceFrom: number | undefined;
      let priceTo: number | undefined;

      // Call the API with all filters
      const response = await getFavoriteLocations({
        page: currentPage,
        limit,
        search: newSearchTerm || undefined,
        city: newRegion || undefined,
        categories: newCategories.length > 0 ? newCategories : undefined,
        priceFrom,
        priceTo,
        userId: user?.id,
      });

      // Update state with the response data
      setLocations(response.data || []);
      setTotalPages(response.totalPages || 0);
      setTotalItems(response.total || 0);
    } catch (err) {
      setError("Failed to fetch locations. Please try again later.");
      console.error("Error fetching locations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const categories = searchParams.get("categories");
    const search = searchParams.get("search");
    const region = searchParams.get("region");

    if (categories || search || region) {
      setSelectedCategory(categories ? categories.split(",") : []);
      setInitialTextValue(search || "");
      setInitialTextValueForSearchTerm(search || "");
      setSelectedRegion(region || null);
    } else {
      setSelectedCategory([]);
      setInitialTextValue("");
      setInitialTextValueForSearchTerm("");
      setSelectedRegion(null);
    }
  }, [location.search]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle sort change
  useEffect(() => {
    if (sortBy === "rating") {
      setLocations((prev) =>
        [...prev].sort((a, b) => {
          return 0;
        })
      );
    } else if (sortBy === "reviews") {
      setLocations((prev) =>
        [...prev].sort((a, b) => {
          return 0;
        })
      );
    }
  }, [sortBy]);

  // Convert locations to map pins - memoized to prevent unnecessary recalculations
  const mapPins = useMemo(() => {
    return locations.map((loc) => ({
      lat: loc.latitude,
      lng: loc.longitude,
      address: loc.googleAddress,
      title: loc.title,
      description:
        loc.description || loc.categories?.join(", ") || "Service provider",
      link: `/listing/${loc.id}`, // Adjust this path as needed
      id: loc.id, // Add id to identify the location
    }));
  }, [locations]);

  // Handle address click to focus on map
  const handleAddressClick = (locationId: string) => {
    setSelectedLocationId(locationId);
    // On mobile, switch to map view and scroll to top
    if (window.innerWidth < 768) {
      setActiveView("map");
      // Scroll to top of the page to make map visible
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Clear selected location
  const handleClearSelection = () => {
    setSelectedLocationId(null);
  };

  // on page load scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle mobile search
  //   const handleMobileSearch = () => {
  //     const params = new URLSearchParams(searchParams);
  //     if (mobileSearchInput.trim()) {
  //       params.set("search", mobileSearchInput.trim());
  //     } else {
  //       params.delete("search");
  //     }
  //     setSearchParams(params);
  //   };

  // Update mobile search input when URL search param changes
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setMobileSearchInput(searchParam);
    } else {
      setMobileSearchInput("");
    }
  }, [searchParams]);

  if (!user) {
    return <ProtectedPage />;
  }

  // Content component to be used in both mobile and desktop views
  const LocationContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchLocations} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      );
    }

    if (locations.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No locations found matching your criteria.
          </p>
          <Button onClick={resetFilters} variant="outline" className="mt-4">
            Clear Filters
          </Button>
        </div>
      );
    }

    return (
      <>
        <LocationCardList
          locations={locations}
          placeholderImage={getLocationPlaceholderImage()}
          onAddressClick={handleAddressClick}
          refetch={fetchLocations}
        />
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <div className="container pb-10 px-3 pt-2 relative">
      {/* Fixed Mobile Search and Tabs */}
      <div className="lg:hidden sticky top-[57px] z-50 bg-background pt-2 pb-3 mb-4 space-y-3">
        <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
          <DrawerTrigger asChild>
            <div className="relative w-full cursor-pointer">
              <Input
                type="text"
                placeholder="Search & Filter"
                value={mobileSearchInput}
                readOnly
                className="pr-10 bg-muted/40 cursor-pointer"
                ref={searchInputRef}
                onClick={(e) => {
                  e.preventDefault();
                  setIsFilterDrawerOpen(true);
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="p-0">
              <VisuallyHidden>
                <DrawerTitle>Search & Filters</DrawerTitle>
              </VisuallyHidden>
            </DrawerHeader>
            <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
              <FilterSidebar
                filterSearchTerm={filterSearchTerm}
                setFilterSearchTerm={setFilterSearchTerm}
                selectedCategory={selectedCategory}
                selectedTitle={selectedTitle}
                setSelectedCategory={setSelectedCategory}
                priceFilter={priceFilter}
                setSelectedTitle={setSelectedTitle}
                setPriceFilter={setPriceFilter}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                onResetFilters={() => {
                  resetFilters();
                  setIsFilterDrawerOpen(false);
                }}
                fetchLocation={() => {
                  fetchLocations();
                }}
                showCategories={false}
                showRegion={false}
                showTitle={true}
                setInitialTextValue={setInitialTextValue}
                initialTextValue={initialTextValue}
              />
            </div>
          </DrawerContent>
        </Drawer>
        {/* Mobile View Toggle */}
        <Tabs
          defaultValue="list"
          className="w-full md:hidden"
          value={activeView}
          onValueChange={(value) => {
            setActiveView(value as "list" | "map");
            // Clear selection when switching back to list view
            if (value === "list") {
              setSelectedLocationId(null);
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Mobile Views */}
        <div className="lg:hidden">
          {activeView === "list" ? (
            <div className="space-y-4 pb-4 mt-14">
              <LocationContent />
            </div>
          ) : (
            <div className="h-[calc(100vh-200px)] min-h-[500px] rounded-lg overflow-hidden border mt-14">
              <div className="relative h-full">
                <GoogleMap
                  // @ts-ignore
                  pins={mapPins}
                  height="100%"
                  width="100%"
                  selectedLocationId={selectedLocationId}
                  onClearSelection={handleClearSelection}
                />
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 min-h-[calc(100vh-320px)]">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 bg-card rounded-lg p-4 border">
              <FilterSidebar
                filterSearchTerm={filterSearchTerm}
                setFilterSearchTerm={setFilterSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                setSelectedTitle={setSelectedTitle}
                selectedRegion={selectedRegion}
                selectedTitle={selectedTitle}
                setSelectedRegion={setSelectedRegion}
                onResetFilters={resetFilters}
                fetchLocation={fetchLocations}
                showCategories={false}
                showRegion={false}
                showTitle={true}
                setInitialTextValue={setInitialTextValue}
                initialTextValue={initialTextValue}
              />
            </div>
          </div>

          {/* Main Content - List */}
          <div className="lg:col-span-5 mt-16">
            <div className="space-y-4">
              <LocationContent />
            </div>
          </div>

          {/* Right Sidebar - Map */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="h-[calc(100vh-200px)] min-h-[500px] relative">
                  <GoogleMap
                    // @ts-ignore
                    pins={mapPins}
                    height="100%"
                    width="100%"
                    zoom={12}
                    selectedLocationId={selectedLocationId}
                    onClearSelection={handleClearSelection}
                  />
                  {selectedLocationId && (
                    <div className="absolute w-[calc(100%-110px)] bottom-4 left-4 right-4 bg-primary p-3 rounded-md shadow-md border border-muted/30 max-w-md mx-auto">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm text-white font-medium">
                            {locations.find(
                              (loc) => loc.id === selectedLocationId
                            )?.title || "Selected Location"}
                          </h3>
                          <span className="text-xs text-white/90">
                            {locations.find(
                              (loc) => loc.id === selectedLocationId
                            )?.googleAddress || "Address not available"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearSelection}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Clear selection</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;
