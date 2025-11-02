"use client"

import { getLocationPlaceholderImage, getLocations } from "@/api/locationApi";
import { useEffect, useMemo, useState } from "react";
import { Location } from "@/types/location";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import React from "react";
import FilterSidebar from "@/components/providers/FilterSidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import LocationCardList from "@/components/providers/LocationCardList";
import PaginationControls from "@/components/providers/PaginationControls";
import GoogleMap from "@/components/ui/GoogleMap";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ProvidersClient = () => {
  const searchParams = useSearchParams(); // Returns only a read-only URLSearchParams object
  const router = useRouter();
  const pathname = usePathname();
  const getInitialRegion = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("region") || null;
  };
  const getInitialSearchTerm = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("search") || "";
  };
  const [searchParamsP, setSearchParams] = useState(useSearchParams());

  const [filterSearchTerm, setFilterSearchTerm] = useState("");

  useEffect(() => {
    setFilterSearchTerm(getInitialSearchTerm());
  }, [searchParams]);

  useEffect(() => {
    if (filterSearchTerm) console.log("filterSearchTerm:", filterSearchTerm);
  }, [filterSearchTerm]);

  const currentPage = Number(searchParams.get("page") || 1);
  const [limit, setLimit] = useState<number>(10);
  const [locations, setLocations] = useState<Location[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [mobileSearchInput, setMobileSearchInput] = useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [activeView, setActiveView] = useState<"list" | "map">("list");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [initialTextValueForSearchTerm, setInitialTextValueForSearchTerm] =
    useState("");
  const [initialTextValue, setInitialTextValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    getInitialRegion()
  );

  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleClearSelection = () => {
    setSelectedLocationId(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    console.log("page", page);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);

    const searchParams = new URLSearchParams(location.search);
    const newSearchTerm = searchParams.get("search") || "";
    const newRegion = searchParams.get("region") || null;
    const rawCategories = searchParams.get("categories") || null;
    const rawName = searchParams.get("title") || null;
    const newCategories = rawCategories ? rawCategories.split(",") : [];

    // console.log(`Fetching locations with:
    //   searchTerm: ${newSearchTerm},
    //   region: ${newRegion},
    //   categories: ${newCategories.join(", ")},
    //   page: ${currentPage},
    //   limit: ${limit}`);

    try {
      // Extract price range from price filter (assuming format like "$", "$$", etc.)
      let priceFrom: number | undefined;
      let priceTo: number | undefined;

      // Call the API with all filters
      const response = await getLocations({
        page: currentPage,
        limit,
        search: newSearchTerm || undefined,
        city: newRegion || undefined,
        categories: newCategories.length > 0 ? newCategories : undefined,
        title: rawName || undefined,
        // priceFrom,
        // priceTo,
      });

      setLocations(response.data || []);
      setTotalPages(response.totalPages || 0);
      setTotalItems(response.total || 0);
    } catch (err) {
      //   setError("Failed to fetch locations. Please try again later.");
      console.error("Error fetching locations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("location.search:", pathname);
    console.log("currentPage:", currentPage);
    fetchLocations();
  }, [searchParams, currentPage]);

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

  const setCurrentPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.append("page", String(page <= 1 ? 1 : page));

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const categories = searchParams.get("categories");
    const search = searchParams.get("search");
    const region = searchParams.get("region");
    const title = searchParams.get("title");

    if (categories || search || region || title) {
      setSelectedCategory(categories ? categories.split(",") : []);
      setInitialTextValue(search || "");
      setInitialTextValueForSearchTerm(search || "");
      setSelectedRegion(region || null);
      setSelectedTitle(title);
    } else {
      setSelectedCategory([]);
      setInitialTextValue("");
      setInitialTextValueForSearchTerm("");
      setSelectedRegion(null);
      setSelectedTitle(null);
    }
  }, [location.search]);

  const resetFilters = () => {
    setCurrentPage(1);
    router.push("/listing");
  };

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

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setMobileSearchInput(searchParam);
    } else {
      setMobileSearchInput("");
    }
  }, [searchParams]);

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
                initialTextValue={initialTextValue}
                setInitialTextValue={setInitialTextValue}
                filterSearchTerm={filterSearchTerm}
                setFilterSearchTerm={setFilterSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceFilter={priceFilter}
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
                selectedTitle={selectedTitle}
                setSelectedTitle={setSelectedTitle}
                showTitle={true}
                showRegion={false}
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
                initialTextValue={initialTextValue}
                setInitialTextValue={setInitialTextValue}
                filterSearchTerm={filterSearchTerm}
                setFilterSearchTerm={setFilterSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                onResetFilters={resetFilters}
                fetchLocation={fetchLocations}
                selectedTitle={selectedTitle}
                setSelectedTitle={setSelectedTitle}
                showRegion={false}
                showTitle={true}
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

export default  ProvidersClient;
