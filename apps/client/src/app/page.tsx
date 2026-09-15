import { Hero } from "@/components/features/hero/Hero";
import { ChatWidget } from "@/components/features/ai-guide/ChatWidget";
import { BentoPreview } from "@/components/features/home/BentoPreview";
import { FeaturedDestinations } from "@/components/features/home/FeaturedDestinations";
import { FAQ } from "@/components/features/home/FAQ";
import { Manifesto } from "@/components/features/home/Manifesto";
import { HowItWorks } from "@/components/features/home/HowItWorks";
import { PressLogos } from "@/components/features/home/PressLogos";
import { Newsletter } from "@/components/features/home/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <BentoPreview />
      <FeaturedDestinations />
      <HowItWorks />
      <Manifesto />
      <FAQ />
      <PressLogos />
      <Newsletter />
      <ChatWidget />
    </main>
  );
}
