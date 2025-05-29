import { Footer } from "@/features/layout/Footer";
import { Header } from "@/features/layout/Header";
import { HeroSection } from "@/features/landing/HeroSection";
import { InfoSection } from "@/features/landing/InfoSection";
import { FarmerSection } from "@/features/landing/FarmerSection";
import { RulesSection } from "@/features/landing/RulesSection";
import { CommunitySection } from "@/features/landing/CommunitySection";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <InfoSection />
        <FarmerSection />
        <RulesSection />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
