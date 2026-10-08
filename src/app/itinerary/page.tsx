import { Metadata } from "next";
import ItineraryClient from "./itinerary-client";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const to = (params.to as string) || "Your Destination";
  const vibe = (params.vibe as string) || "balanced";

  return {
    title: `Trip to ${to} (${vibe}) | TravelMind`,
    description: `A perfectly curated ${vibe} itinerary for your trip to ${to}. Plan your activities, explore local delicacies, and much more with TravelMind.`,
    openGraph: {
      title: `${to} Itinerary | TravelMind`,
      description: `Check out this custom-built itinerary for ${to}.`,
      images: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200"],
    },
  };
}

export default function ItineraryPage() {
  return <ItineraryClient />;
}
