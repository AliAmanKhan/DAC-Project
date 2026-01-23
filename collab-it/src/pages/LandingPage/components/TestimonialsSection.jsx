import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Full-Stack Developer",
    avatar: "SC",
    content: "CollabIt helped me find the perfect designer for my startup. We launched our MVP in just 3 weeks!",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "UI/UX Designer",
    avatar: "MJ",
    content: "The matching algorithm is incredible. I've connected with developers who truly understand my design vision.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    avatar: "ER",
    content: "Building cross-functional teams has never been easier. CollabIt is now essential to our workflow.",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 relative">
      {/* Background glow */}
      <div className="absolute right-0 top-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="gradient-text">Creators</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied collaborators who have found their perfect team.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
