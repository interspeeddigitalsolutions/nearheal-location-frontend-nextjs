// app/providers/[slug]/page.tsx (Server Component - handles metadata)
import { Metadata } from "next";
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
        ? [
            {
              url: location.gallery[0].startsWith("http")
                ? location.gallery[0]
                : `${
                    process.env.NEXT_PUBLIC_APP_URL || "https://nearheal.com.au"
                  }${location.gallery[0]}`,
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
  return <BusinessDetailsClient slug={slug} />;
}
