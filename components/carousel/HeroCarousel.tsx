import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import "@/styles/animations.css";
import { contentHero } from "@/types/location";

// Default images in case the carousel items don't have images
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1581091877018-dac6a371d50f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

interface CarouselItem {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const carouselItems: CarouselItem[] = [
  {
    title: "Empowering Independence",
    description:
      "We provide comprehensive support services that help individuals with disabilities live more independent and fulfilling lives.",
    buttonText: "Explore Services",
    buttonLink: "#services",
    image: DEFAULT_IMAGES[0],
  },
  {
    title: "Personalized Care Plans",
    description:
      "Our experienced team creates customized care plans designed to meet your unique needs and goals.",
    buttonText: "Learn More",
    buttonLink: "#about",
    image: DEFAULT_IMAGES[1],
  },
  {
    title: "Trusted NDIS Provider",
    description:
      "As a registered NDIS provider, we maintain the highest standards of care while helping you maximize your funding.",
    buttonText: "Contact Us",
    buttonLink: "#contact",
    image: DEFAULT_IMAGES[2],
  },
];

const HeroCarousel = ({
  heroContent,
}: {
  heroContent?: contentHero | null;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) =>
      prev ===
      (heroContent?.slideContents ? heroContent.slideContents : carouselItems)
        .length -
        1
        ? 0
        : prev + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) =>
      prev === 0
        ? (heroContent?.slideContents
            ? heroContent?.slideContents
            : carouselItems
          ).length - 1
        : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  // Handle autoplay
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    if (isTransitioning || currentSlide === index) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div
      id="home"
      className="relative h-[300px] md:h-[380px] lg:h-[450px] w-full overflow-hidden bg-[#2d4c41]"
    >
      {/* Carousel Slides */}
      {heroContent && heroContent?.slideContents?.length > 0 ? "" : "nothing"}
      {(heroContent && heroContent?.slideContents?.length > 0
        ? heroContent?.slideContents
        : carouselItems
      ).map((item, index) => (
        <div
          key={index}
          className={`absolute top-0 w-full h-full transition-all duration-700 ease-in-out
                    ${
                      currentSlide === index
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0"
                    }`}
        >
          {/* Background image with overlay - desktop: right-aligned */}
          <div className="absolute inset-0 w-full h-full">
            {/* Mobile view: full width image */}
            <div className="block md:hidden w-full h-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default image if loading fails
                  e.currentTarget.src = DEFAULT_IMAGES[0];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2d4c41] via-[#2d4c41]/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d4c41]/60 via-transparent to-[#2d4c41]/30"></div>
            </div>

            {/* Desktop view: right-aligned image */}
            <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default image if loading fails
                  e.currentTarget.src = DEFAULT_IMAGES[0];
                }}
              />
              {/* Improved gradient blend from left to right */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2d4c41] via-[#2d4c41]/30 to-transparent"></div>
            </div>

            {/* Desktop view: solid background for left side */}
            <div className="hidden md:block absolute top-0 left-0 w-1/2 h-full bg-[#2d4c41]"></div>
          </div>

          {/* Content container */}
          <div className="relative h-full z-20">
            <div className="container mx-auto h-full flex flex-col justify-center px-6 md:pr-0 py-0">
              {/* Content container with animations */}
              <div
                className="max-w-xl space-y-3 text-white"
                style={{
                  transform:
                    currentSlide === index
                      ? "translateY(0)"
                      : "translateY(30px)",
                  opacity: currentSlide === index ? 1 : 0,
                  transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
                }}
              >
                {/* Main title with text shadow and staggered animation */}
                <div className="h-[40px] md:h-[50px] flex items-center">
                  <h1
                    className="text-2xl md:text-4xl font-bold leading-tight drop-shadow-lg"
                    style={{
                      transform:
                        currentSlide === index
                          ? "translateY(0)"
                          : "translateY(20px)",
                      opacity: currentSlide === index ? 1 : 0,
                      transition:
                        "transform 0.5s ease-out, opacity 0.5s ease-out",
                      transitionDelay: "0.2s",
                      textShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    {item.title}
                  </h1>
                </div>

                {/* Animated divider with width animation */}
                <div
                  className="h-1 bg-[#e5b45b] relative overflow-hidden"
                  style={{
                    width: currentSlide === index ? "80px" : "0px",
                    opacity: currentSlide === index ? 1 : 0,
                    transition: "width 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.3s",
                  }}
                >
                  <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
                </div>

                {/* Description with staggered animation */}
                <div className="relative h-[40px] md:h-[60px] flex items-center">
                  <p
                    className="text-xs md:text-base opacity-90 max-w-lg backdrop-blur-[2px] p-1 -ml-1 rounded-lg overflow-hidden"
                    style={{
                      transform:
                        currentSlide === index
                          ? "translateY(0)"
                          : "translateY(20px)",
                      opacity: currentSlide === index ? 1 : 0,
                      transition:
                        "transform 0.5s ease-out, opacity 0.5s ease-out",
                      transitionDelay: "0.4s",
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Button with staggered animation */}
                <div className="pt-1">
                  <div
                    className="relative group inline-block"
                    style={{
                      transform:
                        currentSlide === index
                          ? "translateY(0)"
                          : "translateY(20px)",
                      opacity: currentSlide === index ? 1 : 0,
                      transition:
                        "transform 0.5s ease-out, opacity 0.5s ease-out",
                      transitionDelay: "0.5s",
                    }}
                  >
                    {/* Animated background glow effect */}
                    <div className="absolute -inset-0.5 bg-[#e5b45b]/30 rounded-full blur-sm group-hover:blur-md transition-all duration-500 opacity-70 group-hover:opacity-100"></div>

                    <Button
                      className="relative bg-[#e5b45b] hover:bg-[#d4a54a] text-[#2d4c41] text-[10px] md:text-xs py-1 px-2 rounded-full flex items-center gap-0.5 font-medium shadow-sm hover:shadow-md transition-all duration-300 group-hover:translate-y-[-1px] h-6 md:h-7"
                      onClick={() =>
                        (window.location.href =
                          // @ts-ignore
                          item.buttonLink || item.buttonUrl)
                      }
                    >
                      {item.buttonText}
                      <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Navigation Controls Container - Removed from animated content container */}
              <div
                className="max-w-full flex justify-between items-center mt-2"
                style={{
                  opacity: currentSlide === index ? 1 : 0,
                  transition: "opacity 0.5s ease-out",
                }}
              >
                {/* Indicator Dots */}
                <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10 inline-flex space-x-1">
                  {(heroContent?.slideContents &&
                  heroContent?.slideContents.length > 0
                    ? heroContent?.slideContents
                    : carouselItems
                  ).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className="relative group"
                    >
                      {/* Animated glow effect for active dot */}
                      {currentSlide === index && (
                        <div className="absolute -inset-1 bg-[#e5b45b]/30 rounded-full blur-sm animate-pulse"></div>
                      )}
                      <div
                        className={`transition-all duration-300 rounded-full relative ${
                          currentSlide === index
                            ? "bg-[#e5b45b] w-4 h-1 shadow-[0_0_4px_rgba(229,180,91,0.5)]"
                            : "bg-white/40 hover:bg-white/60 w-1.5 h-1.5 group-hover:scale-110"
                        }`}
                      >
                        {/* Animated loading indicator for active dot */}
                        {currentSlide === index && (
                          <div className="absolute inset-0 overflow-hidden rounded-full">
                            <div
                              className="h-full w-full bg-white/30 -translate-x-full animate-[progressDot_6s_linear]"
                              style={{
                                animationPlayState: "running",
                                animationFillMode: "forwards",
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <div className="flex flex-row gap-2">
                  <div className="relative group">
                    {/* Animated glow effect */}
                    <div className="absolute -inset-1 rounded-full bg-white/0 group-hover:bg-white/20 blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>

                    <button
                      onClick={prevSlide}
                      className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-[#e5b45b] text-white hover:text-[#2d4c41] rounded-full transition-all duration-300 backdrop-blur-sm transform hover:scale-110 hover:shadow-md border border-white/10 group-hover:border-white/30"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft
                        size={14}
                        className="group-hover:-translate-x-0.5 transition-transform duration-300"
                      />
                    </button>
                  </div>

                  <div className="relative group">
                    {/* Animated glow effect */}
                    <div className="absolute -inset-1 rounded-full bg-white/0 group-hover:bg-white/20 blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>

                    <button
                      onClick={nextSlide}
                      className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-[#e5b45b] text-white hover:text-[#2d4c41] rounded-full transition-all duration-300 backdrop-blur-sm transform hover:scale-110 hover:shadow-md border border-white/10 group-hover:border-white/30"
                      aria-label="Next slide"
                    >
                      <ChevronRight
                        size={14}
                        className="group-hover:translate-x-0.5 transition-transform duration-300"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;
