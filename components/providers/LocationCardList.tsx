import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Location } from "@/types/location";
import { ChevronRight, Mail, MapIcon, MapPin, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
// Add custom breakpoint for extra small screens
import {
  getFavoriteLocations,
  postFavorite,
  removeFavorite,
} from "@/api/locationApi";
import { useAuth } from "@/hooks/useAuth";
import "./locationCardList.css";
import { useRouter } from "next/navigation";
import { authServerInfo } from "@/lib/auth";

interface LocationCardListProps {
  locations: Location[];
  placeholderImage?: string;
  onAddressClick?: (locationId: string) => void;
  refetch?: () => void;
  className?: string;
}

// Helper function to render rating stars
const RatingStars = ({ rating = 0 }: { rating?: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          )}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

// Helper function to truncate text
const TruncateText = ({ text, limit }: { text: string; limit: number }) => {
  if (!text) return <span>Not available</span>;
  return text.length > limit ? (
    <span>{text.substring(0, limit)}...</span>
  ) : (
    <span>{text}</span>
  );
};

const LocationCardList = ({
  locations,
  placeholderImage = "/images/location-placeholder.jpg",
  onAddressClick,
  refetch,
  className,
}: LocationCardListProps) => {
  const { user } = useAuth();
  const [favoriteLocations, setFavoriteLocations] = useState<
    { locationId: string; favoriteId: string }[]
  >([]);

  const fetchFavoriteLocations = async () => {
    try {
      const response: any = await getFavoriteLocations({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
        userId: user?.id,
      });
      setFavoriteLocations(
        response?.data?.map((_: any) => ({
          locationId: _.id,
          favoriteId: _?.favoriteId,
        })) || []
      );
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    fetchFavoriteLocations();
  }, [user?.id]);

  if (locations.length === 0) {
    return (
      <div className="bg-muted/20 rounded-lg p-12 text-center">
        <h3 className="text-xl font-medium mb-2">No locations found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search filters or try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-4 ${className ?? ""}`}>
      <TooltipProvider>
        {locations.map((location) => {
          const favorite = favoriteLocations?.find(
            (_) => _.locationId === location.id
          );
          return (
            <LocationCard
              refetch={() => {
                refetch && refetch();
                fetchFavoriteLocations();
              }}
              key={location.id}
              favorite={favorite}
              user={user}
              location={location}
              onAddressClick={onAddressClick}
              placeholderImage={placeholderImage}
            />
          );
        })}
      </TooltipProvider>
    </div>
  );
};

const LocationCard = ({
  location,
  placeholderImage,
  onAddressClick,
  user,
  refetch,
  favorite,
}: {
  location: Location;
  placeholderImage: string;
  onAddressClick: any;
  user: any;
  refetch: any;
  favorite: any;
}) => {
  const router = useRouter();

  const handleFavorite = async () => {
    if (!user?.id) {
      return (window.location.href = `${authServerInfo.url}/login?token=${authServerInfo.clientId}&redirect_url=${authServerInfo.redirectUrl}`);
    }

    try {
      if (!!favorite) await removeFavorite(favorite.favoriteId);
      else await postFavorite(location?.id, user?.id);
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.log("Error to change favorite state");
    }
  };

  return (
    <Card
      key={location.id}
      className="overflow-hidden hover:shadow-md transition-all duration-300 border-muted/40 group relative"
    >
      {/* Card is no longer entirely clickable - only the View Details button */}

      {/* Simple card layout as requested */}
      <div className="flex flex-col">
        {/* Top row: Logo and title */}
        <div className="flex items-center p-4 pb-3">
          {/* Logo */}
          <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-md border border-muted/30 mr-3">
            <img
              src={
                location.gallery && location.gallery.length > 0
                  ? location.gallery[0]
                  : location.logo || placeholderImage
              }
              alt={location.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Title and rating */}
          <div className="flex-1 min-w-0">
            <div className="flex">
              <Link href={`/listing/${location.slug}`}>
                <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors w-full">
                  {location.title}
                </h3>
              </Link>
              <span className="ml-2 cursor-pointer" onClick={handleFavorite}>
                <img
                  src={!!favorite ? "/images/fav-fill.svg" : "/images/fav.svg"}
                  className=""
                  alt=""
                />
              </span>
            </div>
            {/* Address with show in map button */}
            <div className="flex items-start mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-1.5 flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full">
                <span className="text-sm text-muted-foreground line-clamp-1">
                  {location.googleAddress || "Address not available"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs ml-auto sm:ml-0 flex-shrink-0 bg-muted/10 hover:bg-primary hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onAddressClick) {
                      onAddressClick(location.id);
                    }
                  }}
                >
                  <MapIcon className="h-3 w-3 mr-1" />
                  Show in map
                </Button>
              </div>
            </div>
            <div className="flex items-center mt-1">
              {location.priceFrom && location.priceTo && (
                <span className="text-sm text-muted-foreground ml-3">
                  ${location.priceFrom} - ${location.priceTo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal divider with reduced vertical gap */}
        <div className="h-px bg-muted/80 mx-4"></div>

        {/* Provider details */}
        <div className="p-4 pt-2 pb-3">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {location.description || "No description available"}
          </p>

          {/* Limited categories - show only first 3 */}
          {location.categories && location.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {location.categories
                .slice(0, 3)
                .map((category: any, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs py-0 h-5 bg-muted/10 hover:bg-muted/20 transition-colors"
                  >
                    {category}
                  </Badge>
                ))}
              {location.categories.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs py-0 h-5 bg-muted/10 hover:bg-muted/20 transition-colors"
                >
                  +{location.categories.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Bottom row: Claim badge and action buttons */}
        <div className="flex items-center justify-between p-4 pt-2 border-t border-muted/30">
          {/* Contact and action buttons */}
          <div className="flex items-center gap-2">
            {location.phone && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full z-20"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `tel:${location.phone}`;
                    }}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{location.phone}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {location.email && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full z-20"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `mailto:${location.email}`;
                    }}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{location.email}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <Link href={`/listing/${location.slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 hover:bg-primary hover:text-white transition-colors z-20 ml-1"
            >
              View Details
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default LocationCardList;
