"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowUp } from "lucide-react";
import {
  getLocationSlug,
  getLocationPlaceholderImage,
} from "@/api/locationApi";
import { Location } from "@/types/location";
import HeroCarousel from "@/components/carousel/HeroCarousel";
import ProviderOverview from "@/components/sections/ProviderOverview";
import ServicesCarousel from "@/components/sections/ServicesCarousel";
import BusinessHours from "@/components/sections/BusinessHours";
import PricingPlans from "@/components/sections/PricingPlans";
import ContactInfo from "@/components/sections/ContactInfo";
import ProviderHeader from "@/components/sections/ProviderHeader";
import ProviderInfoCard from "@/components/sections/ProviderInfoCard";
import ProviderLayout from "@/components/layout/ProviderLayout";
import { GraphQLClient } from "graphql-request";
import { Job } from "@/types/types";
import JobsSection from "../sections/JobsSection";

interface BusinessDetailsClientProps {
  slug: string;
}

const SEARCH_QUERY = `
  query SearchJobsByCompany($companyId: String!, $input: CommonPaginationDto) {
    jobs__searchByCompany(companyId: $companyId, input: $input) {
        nodes {
        _id
        title
        shortDescription
        isApproved
        isSkipVideoInterview
        longDescription
        publishStatus
        longDescription
        salaryRangeMin
        salaryRangeMax
        jobRoleType
        jobLocationType
        postedBy { _id name email createdAt }
        thumbnail {
          path
          provider
        }
        companyId
        video {
          path
          provider
        }
          
      }
      meta {
        totalCount
        hasNextPage
        totalPages
        currentPage
      }
    }
  }
`;

const client = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_JOB_BACKEND_URL}/graphql`
);

async function fetchJobs(companyId: string) {
  try {
    const data: any = await client.request(SEARCH_QUERY, {
      companyId,
      input: { page: 1, limit: 10 },
    });
    return data.jobs__searchByCompany;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

const BusinessDetailsClient: React.FC<BusinessDetailsClientProps> = ({
  slug,
}) => {
  //   const { slug } = params;
  const [location, setLocation] = useState<Location | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const placeholderImage = getLocationPlaceholderImage();

  // on page load scroll to top - ALWAYS KEEP THIS HOOK FIRST
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle scroll event for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch location details from API
  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const locationData = await getLocationSlug(slug);
        if (locationData) {
          setLocation(locationData);
          const jobsData = await fetchJobs(locationData.id);
          if (jobsData && jobsData.nodes) {
            setJobs(jobsData.nodes);
          }
        } else {
          setError("Provider not found");
        }
      } catch (err) {
        console.error("Error fetching location details:", err);
        setError("Failed to load location details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationDetails();
  }, [slug]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <ProviderLayout>
        <div className="container mx-auto py-16 text-center">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProviderLayout>
    );
  }

  // Error or location not found
  if (error || !location) {
    return (
      <ProviderLayout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Provider Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error ||
              "The location you're looking for doesn't exist or may have been removed."}
          </p>
        </div>
      </ProviderLayout>
    );
  }

  return (
    // <ProviderLayout>
    <div>
      {/* Provider Header - Prominently displays the provider name and logo */}
      <ProviderHeader location={location} />

      {/* Main content with appropriate spacing for fixed headers */}
      <div className="pt-[75px] md:pt-[90px] ">
        {/* Hero Carousel with Provider Info Card overlapping */}
        <div className="relative">
          <HeroCarousel heroContent={location?.contentHero} />

          {/* Provider Info Card - Positioned so only the logo overlaps with the carousel */}
          <div className="container mx-auto px-4 relative -mt-10">
            <ProviderInfoCard location={location} />
          </div>
        </div>

        {/* Provider Overview Section */}
        <ProviderOverview location={location} />

        {/* Services Carousel Section */}
        <ServicesCarousel location={location} />

        {/* Business Hours Section */}
        <BusinessHours location={location} />

        {/* Pricing Plans Section */}
        <PricingPlans location={location} />

        {/* Contact Information Section */}
        <ContactInfo location={location} />

        <JobsSection jobs={jobs} locationId={location.id} />
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg z-50 hover:bg-primary/90 transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
    // </ProviderLayout>
  );
};

export default BusinessDetailsClient;
