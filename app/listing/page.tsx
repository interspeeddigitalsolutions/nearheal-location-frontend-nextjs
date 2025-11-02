import ProvidersClient from "@/components/providers/ProvidersClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nearheal.com.au';

  return {
    title: "Healthcare Providers Directory",
    description: "Find and connect with trusted healthcare providers and NDIS services near you. Browse our comprehensive directory of medical professionals.",
    keywords: [
      "healthcare providers",
      "NDIS services",
      "medical professionals",
      "healthcare directory",
      "Australia healthcare",
      "find doctors",
      "healthcare services"
    ],
    openGraph: {
      title: "Healthcare Providers Directory | Nearheal",
      description: "Find and connect with trusted healthcare providers and NDIS services near you. Browse our comprehensive directory of medical professionals.",
      url: `${baseUrl}/listing`,
      images: [{
        url: `${baseUrl}/near_heal_logo.jpeg`,
        width: 1200,
        height: 630,
        alt: "Nearheal Providers Directory",
      }],
      type: "website",
      siteName: "Nearheal",
    },
    twitter: {
      card: "summary_large_image",
      title: "Healthcare Providers Directory | Nearheal",
      description: "Find and connect with trusted healthcare providers and NDIS services near you. Browse our comprehensive directory of medical professionals.",
      images: [`${baseUrl}/near_heal_logo.jpeg`],
    },
    alternates: {
      canonical: `${baseUrl}/listing`,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}



export default function ProvidersPage() {
  return <ProvidersClient />;
}
