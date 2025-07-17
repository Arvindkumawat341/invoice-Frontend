"use client";
import { IndiaMap } from "@/components/ui/world-map";

export function IndiaMapDemo() {
  return (
    <div className="py-40 dark:bg-black bg-white w-full">
      <div className="max-w-7xl mx-auto text-center"></div>
      <IndiaMap
        dots={[
          {
            start: { lat: 26.9124, lng: 75.7873 }, // jaipur
            end: { lat: 38.7946, lng: 106.5348 }, // usa
          },
          {
            start: { lat: 26.9124, lng: 75.7873 }, // jaipur
            end: { lat: 8.7832, lng: 34.5085 }, // usa
          },
        ]}
      />
    </div>
  );
}
