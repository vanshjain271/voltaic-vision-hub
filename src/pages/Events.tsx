import Navigation from "@/components/Navigation";
import { EventsSection } from "@/components/EventsSection";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Events</h1>
          <EventsSection />
        </div>
      </main>
    </div>
  );
};

export default Events;