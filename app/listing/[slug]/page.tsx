// app/providers/[slug]/page.tsx (Server Component - handles metadata)
import { Metadata } from "next";
import Script from "next/script";
import { getLocationSlug } from "@/api/locationApi";
import BusinessDetailsClient from "@/components/providers/BusinessDetailsClient";

// Add this type
type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata function - now properly in server component
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const location = await getLocationSlug(slug);
    if (!location) {
      return {
        title: "Provider Not Found | Nearheal",
        description: "The requested healthcare provider could not be found.",
        openGraph: {
          title: "Provider Not Found | Nearheal",
          description: "The requested healthcare provider could not be found.",
          images: [
            {
              url: `${
                process.env.NEXT_PUBLIC_APP_URL || "https://nearheal.com.au"
              }/near_heal_logo.jpeg`,
              width: 1200,
              height: 630,
              alt: "Nearheal",
            },
          ],
        },
      };
    }

    const images =
      location.gallery && location.gallery.length > 0
        ? location.gallery.map((img, index) => ({
            url: img.startsWith("http")
              ? img
              : `${
                  process.env.NEXT_PUBLIC_APP_URL || "https://nearheal.com.au"
                }${img}`,
            width: 1200,
            height: 630,
            alt: `${location.title} - Image ${index + 1}`,
          }))
        : location.logo
        ? [
            {
              url: location.logo.startsWith("http")
                ? location.logo
                : `${
                    process.env.NEXT_PUBLIC_APP_URL || "https://nearheal.com.au"
                  }${location.logo}`,
              width: 1200,
              height: 630,
              alt: location.title,
            },
          ]
        : [
            {
              url: `${
                process.env.NEXT_PUBLIC_APP_URL || "https://nearheal.com.au"
              }/near_heal_logo.jpeg`,
              width: 1200,
              height: 630,
              alt: "Nearheal Provider",
            },
          ];

    const description =
      location.description ||
      `Learn more about ${location.title} and their healthcare services on Nearheal. Find contact information, services, and more.`;

    return {
      title: `${location.title} - Healthcare Provider | Nearheal`,
      description: description,
      keywords: [
        location.title,
        ...(location.categories || []),
        "healthcare provider",
        "medical services",
        "NDIS services",
        "Australia healthcare",
      ],
      openGraph: {
        type: "article",
        locale: "en_AU",
        url: `${
          process.env.NEXT_PUBLIC_APP_URL || "https://nearheal.com.au"
        }/listing/${slug}`,
        title: `${location.title} - Healthcare Provider`,
        description: description,
        siteName: "Nearheal",
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: `${location.title} - Healthcare Provider`,
        description: description,
        images: [images[0].url],
      },
      alternates: {
        canonical: `${
          process.env.NEXT_PUBLIC_APP_URL || "https://nearheal.com.au"
        }/listing/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata for provider:", error);
    return {
      title: "Healthcare Provider | Nearheal",
      description:
        "Find healthcare providers and medical services on Nearheal.",
      openGraph: {
        title: "Healthcare Provider | Nearheal",
        description:
          "Find healthcare providers and medical services on Nearheal.",
        images: [
          {
            url: `${
              process.env.NEXT_PUBLIC_APP_URL || "https://nearheal.com.au"
            }/near_heal_logo.jpeg`,
            width: 1200,
            height: 630,
            alt: "Nearheal",
          },
        ],
      },
    };
  }
}

export default async function ProviderSlugPage({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationSlug(slug);

  if (!location) {
    return <div>Provider not found</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nearheal.com.au";

  // Parse address into components
  // Use googleAddress (which matches your database field)
  const primaryAddress = location.googleAddress || location.location;
  
  const parseAddress = (address: string) => {
    if (!address) return {};
    
    // Handle format: "Shop 9-16 Tahmoor Shopping Village, Tahmoor, NSW 2573"
    const parts = address.split(",").map(p => p.trim());
    
    // Extract state and postal code from last part (e.g., "NSW 2573")
    const statePostal = parts[parts.length - 1] || "";
    const statePostalMatch = statePostal.match(/([A-Z]{2,3})\s+(\d{4})/);
    
    return {
      streetAddress: parts[0] || "", // "Shop 9-16 Tahmoor Shopping Village"
      addressLocality: parts[1] || "", // "Tahmoor"
      addressRegion: statePostalMatch?.[1] || "NSW", // "NSW"
      postalCode: statePostalMatch?.[2] || "", // "2573"
      addressCountry: "AU",
    };
  };

  const addressParts = parseAddress(primaryAddress);

  // LocalBusiness Schema for Google Rich Results
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/listing/${slug}`,
    name: location.title,
    description: location.description || `${location.title} - Healthcare Provider`,
    url: `${baseUrl}/listing/${slug}`,
    telephone: location.phone || "",
    email: location.email || "",
    // Use googleAddress as primary address for structured data
    address: primaryAddress ? {
      "@type": "PostalAddress",
      ...addressParts,
    } : undefined,
    // Add full location text for additional context
    location: location.location ? {
      "@type": "Place",
      name: location.location,
    } : undefined,
    image: location.gallery?.[0] || `${baseUrl}/near_heal_logo.jpeg`,
    priceRange: location.priceFrom && location.priceTo 
      ? `${location.priceFrom}-${location.priceTo}` 
      : undefined,
    // aggregateRating: location.rating ? {
    //   "@type": "AggregateRating",
    //   ratingValue: location.rating,
    //   reviewCount: location.reviewCount || 1,
    // } : undefined,
    geo: location.latitude && location.longitude ? {
      "@type": "GeoCoordinates",
      latitude: location.latitude,
      longitude: location.longitude,
    } : undefined,
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Providers",
        item: `${baseUrl}/listing`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: location.title,
        item: `${baseUrl}/listing/${slug}`,
      },
    ],
  };

  // Service Schema (if categories are available)
  const serviceSchema = location.categories && location.categories.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: location.categories,
    provider: {
      "@type": "LocalBusiness",
      name: location.title,
    },
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
  } : null;

  return (
    <>
      {/* LocalBusiness Structured Data */}
      <Script
        id="schema-local-business"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Breadcrumb Structured Data */}
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Service Structured Data (if applicable) */}
      {serviceSchema && (
        <Script
          id="schema-service"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}

      <BusinessDetailsClient slug={slug} />
    </>
  );
}