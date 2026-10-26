"use client";

import { LoadScript, Libraries } from "@react-google-maps/api";

const libraries: Libraries = ["places"];

export default function GoogleMapsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // Authentication and public navigation must remain available without Maps.
  if (!apiKey) return <>{children}</>;
  return (
    <LoadScript
      loadingElement={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
      googleMapsApiKey={apiKey}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
}
