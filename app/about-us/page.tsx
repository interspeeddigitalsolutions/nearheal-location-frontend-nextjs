import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Nearheal",
  description:
    "Learn more about Nearheal's mission, vision, and values. We are a healthcare and learning platform committed to empowering communities with world-class health services.",
  keywords: [
    "About Nearheal",
    "healthcare platform",
    "NDIS services",
    "healthcare Australia",
    "medical services",
    "Nearheal vision",
    "Nearheal mission",
  ],
  // Use absolute URLs for better social media sharing
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://nearheal.com.au'}/about-us`,
    title: "About Us | Nearheal",
    description:
      "Discover Nearheal's mission, vision, and values. We connect healthcare professionals and empower communities with innovative health solutions.",
    siteName: "Nearheal",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://nearheal.com.au'}/near_heal_logo.jpeg`,
        width: 1200,
        height: 630,
        alt: "About Nearheal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Nearheal",
    description:
      "Nearheal is building an innovative, resilient, and compassionate healthcare ecosystem in Australia. Learn more about us.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://nearheal.com.au'}/near_heal_logo.jpeg`],
  },
  // Add alternates for better SEO
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://nearheal.com.au'}/about-us`,
  },
};


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background mt-10">
      <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              About Nearheal
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your complete healthcare and learning platform, connecting
              professionals worldwide.
            </p>
          </div>

          {/* Vision Section */}
          <section className="mb-12">
            <div className="bg-card rounded-lg p-6 sm:p-8 border shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                Vision Nearheal
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nearheal assumes the vision to enable the community to enjoy
                  world-class health service within its reach. Nearheal
                  envisions self-sustaining local communities being capable of
                  producing the highest quality health services for themselves.
                </p>
                <p>
                  To realise this vision, Nearheal maintains active engagement
                  with the members of the community as well as local health
                  service providers to be their most trusted destination for
                  obtaining accurate and insightful knowledge and information
                  regarding health services within their community.
                </p>
                <p>
                  To enable world-class service delivery, Nearheal is utmost
                  committed to maintaining a close working relationship with the
                  health service providers to equip them with the latest
                  technological capabilities to optimize the cost as well as to
                  enhance the quality of health services.
                </p>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="mb-12">
            <div className="bg-card rounded-lg p-6 sm:p-8 border shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                Mission Nearheal
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nearheal is a Sydney-based Australian health technology startup
                working compassionately to build an innovative, resilient, and
                competitive health service eco-system in Australia. Team
                Nearheal is highly dedicated and committed to fostering building
                a self-adaptive and agile community that will thrive for
                nurturing a sustainable health service system.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-12">
            <div className="bg-card rounded-lg p-6 sm:p-8 border shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                Nearheal Values
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">F</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Fairness
                  </h3>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">E</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Equality
                  </h3>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">J</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Justice
                  </h3>
                </div>
              </div>
            </div>
          </section>

          {/* Goals Section */}
          <section className="mb-12">
            <div className="bg-card rounded-lg p-6 sm:p-8 border shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
                Nearheal's Goals and Objectives
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To reach the health service seekers within the local
                    community with authentic, accurate, and insightful
                    information about health service providers.
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To build a dynamic culture of excellence among the health
                    services providers through relentless persuasion and
                    diffusion of service innovation.
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To pursue micro-level service innovation and optimization
                    aiming for system-level impact benefiting local communities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <div className="bg-primary/5 rounded-lg p-6 sm:p-8 border border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Get in Touch
              </h2>
              <p className="text-center text-muted-foreground mb-6">
                Have questions about our mission or want to learn more about how
                we can help your community?
              </p>
              <div className="text-center space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href="mailto:contact@nearheal.com.au"
                    className="text-primary hover:underline"
                  >
                    contact@nearheal.com.au
                  </a>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span>{" "}
                  <a
                    href="tel:+61451645094"
                    className="text-primary hover:underline"
                  >
                    +61 451 645 094
                  </a>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Address:</span> 3/8 Mackie st,
                  Coniston, NSW 2500, Australia
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
