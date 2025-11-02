import React from "react";
import { Location } from "@/types/location";
import {
  Phone,
  Shield,
  Sparkles,
  Heart,
  MapPin,
  ArrowRight,
  Contact,
} from "lucide-react";
import { Button } from "../ui/button";

interface ProviderHeaderProps {
  location: Location;
}

const ProviderHeader: React.FC<ProviderHeaderProps> = ({ location }) => {
  return (
    <section className="relative bg-gradient-to-r from-[#2d4c41] via-[#3a5f52] to-[#2d4c41] top-[38px] z-40 shadow-2xl overflow-hidden w-full mt-5">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e5b45b]/10 via-transparent to-[#2d4c41]/20"></div>
      <div className="absolute top-0 left-0 w-40 h-40 bg-[#e5b45b]/15 rounded-full -translate-x-20 -translate-y-20 animate-pulse blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#4a6b5d]/20 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000 blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 relative">
        {/* Mobile Layout - Increased height to prevent truncation */}
        <div className="block md:hidden py-2">
          {/* Provider name only - no logo or address */}
          <div className="flex items-center justify-center min-h-[40px]">
            <h1 className="text-2xl font-bold text-white leading-tight drop-shadow-lg font-serif tracking-wide px-2 text-center">
              {location.title}
            </h1>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center py-1.5">
          {/* Provider name only */}
          <h1 className="text-3xl font-bold text-white leading-tight drop-shadow-lg font-serif tracking-wide">
            {location.title}
          </h1>
        </div>

        {/* Enhanced action buttons section with neon effect - Compact for mobile */}
        <div className="border-t border-white/20 py-1.5 md:py-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e5b45b]/10 to-transparent animate-pulse"></div>

          <div className="relative flex items-center justify-between max-w-md mx-auto">
            {/* Professional NDIS Badge */}
            {/* <div className="relative group cursor-pointer flex-1 mr-2">
              <div className="text-[#e5b45b] bg-[#e5b45b]/15 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#e5b45b]/10 transition-all duration-300 hover:border-[#e5b45b] hover:shadow-lg">
                <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>NDIS Registered</span>
              </div>
            </div> */}

            {/* Professional Call Button */}
            <a
              href={location?.phone ? `tel:${location.phone}` : "#contact"}
              className="flex-1 ml-2"
            >
              <div className="relative group">
                <button className="w-full bg-gradient-to-r from-[#e5b45b] to-[#f4c76b] hover:from-[#f4c76b] hover:to-[#e5b45b] text-[#2d4c41] px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-xs">
                  <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Call Now</span>
                </button>
              </div>
            </a>

            <div
              className="relative group cursor-pointer flex-1 mr-2"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <div className="text-[#e5b45b] bg-[#e5b45b]/15 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#e5b45b]/10 transition-all duration-300 hover:border-[#e5b45b] hover:shadow-lg">
                <Contact className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>Get in touch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderHeader;
