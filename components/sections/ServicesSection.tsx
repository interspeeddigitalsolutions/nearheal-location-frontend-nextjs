import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { categories } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const ServicesSection = () => {
  const { handleLogin } = useAuth();

  return (
    <section className="py-12 sm:py-20">
      <div className="container mx-auto px-4 space-y-16 sm:space-y-32">
        {/* Affordable Assistance - Stacked Cards */}
        {/* <div className="relative">
          <div className="bg-[#F1F0FB] p-6 sm:p-12 rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
                  Access Affordable Assistance for Everyone{" "}
                </h3>
                <p className="text-lg sm:text-xl text-primary-foreground/85 mb-6">
                  Access quality services with full confidence{" "}
                </p>
                <a
                  href="/providers"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg"
                >
                  Search providers
                </a>
              </div>
              <div className="relative">
                <div className="absolute top-4 right-4 w-full h-full bg-primary/5 rounded-2xl"></div>
                <div className="absolute top-2 right-2 w-full h-full bg-primary/10 rounded-2xl"></div>
                <Image
                  src="https://images.unsplash.com/photo-1464998857633-50e59fbf2fe6?auto=format&fit=crop&w=800"
                  alt="Affordable Assistance"
                  width={800}
                  height={600}
                  className="rounded-2xl shadow-xl w-full relative z-10"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* Tailored Services - Stacked Cards */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#D3E4FD] p-6 sm:p-12 rounded-3xl">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1461532257246-777de18cd58b?auto=format&fit=crop&w=800"
              alt="Tailored Services"
              width={800}
              height={600}
              className="rounded-2xl shadow-xl w-full"
            />
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Tailored Services Just for You
            </h3>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-6">
              Uncover options that perfectly fit your unique needs.
            </p>
          </div>
        </div> */}

        {/* Inclusive Community - Split with Diagonal */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#FFDEE2] transform -skew-y-3"></div>
          <div className="relative container mx-auto px-4 py-12 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1687360441027-27e70655b27e?auto=format&fit=crop&w=800"
                  alt="Inclusive Community"
                  width={800}
                  height={600}
                  className="rounded-2xl shadow-xl w-full"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
                  Be Part of Our Inclusive Nearheal Community{" "}
                </h3>
                <p className="text-lg sm:text-xl text-primary-foreground/85 mb-6">
                  Join a network that values connection and support.
                </p>

                <div className="w-full sm:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full cursor-pointer sm:w-auto bg-primary hover:bg-gray-50 px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleLogin}
                  >
                    {/* <Link href="/membership"> */}
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
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
                      Become a Nearheal Member
                    </div>
                    {/* </Link> */}
                  </Button>
                  {/* <p className="text-white/80 text-sm mt-2">
                      Access premium healthcare services
                    </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Caring Community - Card Grid Layout */}
        <div className="bg-[#FEF7CD] p-6 sm:p-12 rounded-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Your Services, Your Control{" "}
            </h3>
            <p className="text-lg sm:text-xl text-primary-foreground/85">
              Take control of the customization, upload contents, create
              services and many more{" "}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Image
              src="https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?auto=format&fit=crop&w=400"
              alt="Caring Community 1"
              width={400}
              height={300}
              className="rounded-2xl shadow-xl w-full aspect-video object-cover"
            />
            <Image
              src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=400"
              alt="Caring Community 2"
              width={400}
              height={300}
              className="rounded-2xl shadow-xl w-full aspect-video object-cover"
            />
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400"
              alt="Caring Community 3"
              width={400}
              height={300}
              className="rounded-2xl shadow-xl w-full aspect-video object-cover hidden lg:block"
            />
          </div>

          <div className="flex items-center justify-center gap-3 py-1 mt-10 sm:w-auto sm:flex-1 ">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="cursor-pointer bg-primary text-white px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
                <span className="whitespace-nowrap">Join as a Provider</span>
              </div>
            </Button>
          </div>
        </div>

        {/* NDIS Categories Section */}
        <section className=" sm:py-20">
          <div className="container mx-auto px-4 space-y-16 sm:space-y-32">
            <div className="relative">
              <div className="bg-indigo-50 p-6 sm:p-12 rounded-3xl">
                <div className="text-center mb-8 sm:mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
                    Find the Right NDIS Provider for Your Special Care Needs
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/listing?categories=${encodeURIComponent(
                        category
                      )}`}
                      className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-primary transition-colors duration-300 leading-tight">
                          {category}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400"
              alt="Explore Nearheal"
              width={400}
              height={300}
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="relative bg-gradient-to-r from-primary/90 to-primary/70 p-8 sm:p-16 text-center">
            <h2 className="text-2xl sm:text-3xl text-primary-foreground font-bold mb-4">
              Explore Nearheal and Find Support Today
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/85 mb-6 sm:mb-8">
              Start navigating the support options designed for your needs.
            </p>
            <Link
              href="/listing"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors text-base sm:text-lg font-medium"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
