import { Search, Users, MessageSquare, Rocket, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description: "Our AI-powered algorithm connects you with collaborators who perfectly match your project needs and skill requirements."
  },
  {
    icon: Users,
    title: "Team Building",
    description: "Build your dream team from a diverse pool of developers, designers, and creators from around the world."
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Communicate seamlessly with built-in messaging, video calls, and collaborative workspaces."
  },
  {
    icon: Rocket,
    title: "Project Launch",
    description: "Get your projects off the ground faster with pre-built templates and workflow automation."
  },
  {
    icon: Shield,
    title: "Secure Collaboration",
    description: "Your code and ideas are protected with enterprise-grade security and NDA agreements."
  },
  {
    icon: Zap,
    title: "Fast Onboarding",
    description: "Start collaborating in minutes with our streamlined onboarding and project setup process."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Collaborate</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features designed to make finding and working with collaborators effortless.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
