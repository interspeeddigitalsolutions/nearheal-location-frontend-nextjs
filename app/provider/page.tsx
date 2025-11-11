import { redirect } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: { search?: string };
}): Promise<Metadata> {
    // const search = searchParams.search ?? "";
    const params = await searchParams;
    const search = params?.search ?? "";
    const name = decodeURIComponent(search || "Healthcare Providers");
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // More descriptive and keyword-rich title and description
    const title = search
        ? `${name} - Find Healthcare Providers | Nearheal Australia`
        : `Find Healthcare Providers & NDIS Services | Nearheal Australia`;

    const description = search
        ? `Search for ${name} on Nearheal. Find verified healthcare providers, NDIS services, and medical specialists across Australia. Book appointments online.`
        : `Search and find trusted healthcare providers, NDIS services, GPs, specialists, and allied health professionals across Australia. Compare services, read reviews, and book appointments on Nearheal.`;

    return {
        title,
        description,
        keywords: [
            "healthcare providers Australia",
            "NDIS services",
            "medical specialists",
            "find doctor",
            "healthcare search",
            "allied health professionals",
            search && name,
        ].filter(Boolean).join(", "),
        alternates: {
            canonical: search
                ? `${baseUrl}/provider?search=${encodeURIComponent(search)}`
                : `${baseUrl}/provider`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            }
        },
        openGraph: {
            title,
            description,
            url: search
                ? `${baseUrl}/provider?search=${encodeURIComponent(search)}`
                : `${baseUrl}/provider`,
            images: [{
                url: `${baseUrl}/near_heal_logo.jpeg`,
                width: 1200,
                height: 630,
                alt: "Nearheal - Healthcare Provider Directory",
            }],
            siteName: "Nearheal",
            type: "website",
            locale: "en_AU",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`${baseUrl}/near_heal_logo.jpeg`],
        },
        other: {
            "geo.region": "AU",
            "geo.placename": "Australia",
        }
    };
}

export default async function Provider({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }> | { search?: string };
}) {
    const params = await searchParams;
    const search = params?.search ?? "";

    if (search) {
        const redirectUrl = `/listing?title=${encodeURIComponent(search)}`;
        redirect(redirectUrl);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Enhanced WebSite Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Nearheal",
        url: baseUrl,
        description: "Find trusted healthcare providers and NDIS services across Australia",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${baseUrl}/provider?search={search_term_string}`
            },
            "query-input": "required name=search_term_string",
        },
    };

    // Enhanced Organization Schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Nearheal",
        url: baseUrl,
        logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/near_heal_logo.jpeg`,
        },
        description: "Australia's trusted healthcare provider directory and NDIS service finder",
        areaServed: {
            "@type": "Country",
            name: "Australia"
        },
        serviceType: ["Healthcare Directory", "NDIS Services", "Medical Provider Search"],
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${baseUrl}`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Provider Search",
                item: `${baseUrl}/provider`,
            },
        ],
    };

    // Add FAQ Schema for better SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How do I find healthcare providers on Nearheal?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Use our search feature to find healthcare providers by name, specialty, or service type. You can filter results by location and service offerings."
                }
            },
            {
                "@type": "Question",
                name: "Does Nearheal list NDIS providers?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, Nearheal includes NDIS registered providers across Australia. Search for NDIS services in your area to find qualified support providers."
                }
            },
            {
                "@type": "Question",
                name: "Are all providers on Nearheal verified?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "We list verified and registered healthcare providers across Australia, including GPs, specialists, and allied health professionals."
                }
            }
        ]
    };

    return (
        <>
            {/* Structured Data Scripts */}
            <Script
                id="schema-website"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <Script
                id="schema-org"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <Script
                id="schema-breadcrumb"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Script
                id="schema-faq"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <main className="container mx-auto py-20 px-4">
                {/* Main Heading with better keyword optimization */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Find Healthcare Providers & NDIS Services in Australia
                    </h1>
                </header>
            </main>
        </>
    );
}