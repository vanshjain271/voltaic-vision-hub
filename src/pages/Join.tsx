import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Join = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    reasonToJoin: '',
    priorExperience: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('join_applications')
        .insert({
          name: formData.name,
          roll_number: formData.rollNumber,
          branch: formData.branch,
          reason_to_join: formData.reasonToJoin,
          prior_experience: formData.priorExperience || null
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully. We'll review it and get back to you soon!",
      });

      // Reset form
      setFormData({
        name: '',
        rollNumber: '',
        branch: '',
        reasonToJoin: '',
        priorExperience: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-foreground">Join Our Network</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Ready to be part of something amazing? Fill out this application to join our club network.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number *</Label>
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch/Department *</Label>
                    <Input
                      id="branch"
                      name="branch"
                      type="text"
                      value={formData.branch}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Computer Science, Electronics, Mechanical"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reasonToJoin">Why do you want to join our network? *</Label>
                    <Textarea
                      id="reasonToJoin"
                      name="reasonToJoin"
                      value={formData.reasonToJoin}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Tell us about your motivation and what you hope to gain from joining our network..."
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priorExperience">Prior Experience (Optional)</Label>
                    <Textarea
                      id="priorExperience"
                      name="priorExperience"
                      value={formData.priorExperience}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any relevant experience, projects, or achievements you'd like to share..."
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your application will be reviewed by our admins</li>
                    <li>• We'll contact you within 5-7 business days</li>
                    <li>• If accepted, you'll receive further instructions</li>
                    <li>• Questions? Contact our admin team</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Join;