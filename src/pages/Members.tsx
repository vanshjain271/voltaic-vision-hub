import Navigation from "@/components/Navigation";
import { MembersDirectory } from "@/components/MembersDirectory";

const Members = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Member Directory</h1>
          <MembersDirectory />
        </div>
      </main>
    </div>
  );
};

export default Members;