import React from "react";
import { Check, Calendar, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Location } from "@/types/location";

interface PricingPlansProps {
  location: Location;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ location }) => {


  // Pricing plans based on the provided data
  const pricingPlans = [
    {
      name: "28-Day Accommodation Fee",
      billing: "Every 28 days (in advance)",
      description: "Fixed for all properties. Charged 13 times/year. Entry/exit calculated daily based on 1/28 rate.",
      features: [
        "Utilities (electricity, gas, water, internet)",
        "Food",
        "Household consumables",
        "Communal furnishings"
      ],
      isPopular: true,
      buttonText: "Learn More"
    },
    {
      name: "Utilities Only Fee",
      billing: "Monthly (in arrears)",
      description: "No food or communal items included. Cannot be opted out of individually unless by all housemates.",
      features: [
        "Electricity",
        "Gas",
        "Water",
        "Internet",
        "Phone"
      ],
      isPopular: false,
      buttonText: "Get Details"
    },
    {
      name: "Daily Accommodation Fee",
      billing: "Daily",
      description: "Available only in ACT properties managed by Havelock Housing. Calculated at 83% of 28-day rate.",
      features: [
        "Shared food costs only",
        "Utilities handled externally"
      ],
      isPopular: false,
      buttonText: "Contact Us"
    },
    {
      name: "Room Holding Credit",
      billing: "Applied per day absent",
      description: "Calculated as 80% of daily 28-day rate. Only applies to 28-day plan users.",
      features: [
        "Credit for food not consumed during approved absences"
      ],
      isPopular: false,
      buttonText: "Learn More"
    }
  ];

  if (location?.claimStatus !== 'claimed') {
    return ''
  } else {
    return ``
  }

  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col mb-12">
          <div className="text-[#e5b45b] font-medium mb-4">— ACCOMMODATION PLANS</div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-4xl font-bold mb-2">Choose Your <span className="text-[#2d4c41]">Accommodation Plan</span></h2>
              <p className="text-gray-600 max-w-2xl">
                Select the right accommodation plan that best suits your needs and circumstances
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full ${plan.isPopular
                ? 'border-2 border-[#e5b45b] shadow-lg transform md:-translate-y-2'
                : 'border border-gray-200 shadow-md'
                }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-[#e5b45b] text-[#2d4c41] px-4 py-1 text-sm font-bold">
                  Most Popular
                </div>
              )}

              <div className="bg-white p-8 flex flex-col flex-grow">
                <div className="mb-auto">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-center mb-4 bg-[#2d4c41]/10 px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4 mr-2 text-[#2d4c41]" />
                    <span className="text-sm font-medium text-[#2d4c41]">{plan.billing}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="bg-[#2d4c41]/10 rounded-full p-1 mr-3 flex-shrink-0">
                          <Check className="h-4 w-4 text-[#2d4c41]" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* <div className="mt-auto pt-4">
                  <Button 
                    className={`w-full rounded-full ${plan.isPopular 
                      ? 'bg-[#e5b45b] hover:bg-[#d4a54a] text-[#2d4c41]' 
                      : 'bg-white text-[#2d4c41] border-[#2d4c41] hover:bg-[#2d4c41]/5'}`}
                    variant={plan.isPopular ? "default" : "outline"}
                  >
                    {plan.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-gray-600 max-w-3xl mx-auto p-6 bg-[#2d4c41]/5 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Info className="h-5 w-5 mr-2 text-[#2d4c41]" />
            <p className="font-medium text-[#2d4c41]">Important Information</p>
          </div>
          <p>Accommodation fees are subject to change and may vary based on property location and specific circumstances.</p>
          <p className="mt-2">Please contact our accommodation team for current rates and to discuss your specific requirements.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
