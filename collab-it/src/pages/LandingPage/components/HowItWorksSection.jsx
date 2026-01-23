import { UserPlus, FolderSearch, Handshake, PartyPopper } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description: "Sign up and showcase your skills, experience, and the type of projects you're interested in."
  },
  {
    icon: FolderSearch,
    step: "02",
    title: "Browse or Post Projects",
    description: "Explore existing projects looking for collaborators or post your own project idea."
  },
  {
    icon: Handshake,
    step: "03",
    title: "Connect & Collaborate",
    description: "Match with like-minded creators, discuss ideas, and form your dream team."
  },
  {
    icon: PartyPopper,
    step: "04",
    title: "Build & Launch",
    description: "Work together using our collaboration tools and bring your project to life."
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            How <span className="gradient-text">CollabIt</span> Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Get started in minutes and find your perfect collaborators in four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative flex gap-6 md:gap-10 items-start"
              >
                {/* Step number and icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
