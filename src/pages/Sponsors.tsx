import Navigation from "@/components/Navigation";
import { SponsorsSection } from "@/components/SponsorsSection";

const Sponsors = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Our Sponsors</h1>
          <SponsorsSection />
        </div>
      </main>
    </div>
  );
};

export default Sponsors;