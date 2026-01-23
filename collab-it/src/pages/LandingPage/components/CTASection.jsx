import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5" />
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-[60px]" />

          {/* Content */}
          <div className="relative z-10 px-8 py-16 md:py-20 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 max-w-2xl mx-auto">
              Ready to Find Your{" "}
              <span className="gradient-text">Dream Team?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Join CollabIt today and connect with talented creators who are ready to bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl">
                View Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Free forever for solo collaborators
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
