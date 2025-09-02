import Navigation from "@/components/Navigation";
import { BlogSection } from "@/components/BlogSection";

const Blogs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Blog & Updates</h1>
          <BlogSection />
        </div>
      </main>
    </div>
  );
};

export default Blogs;