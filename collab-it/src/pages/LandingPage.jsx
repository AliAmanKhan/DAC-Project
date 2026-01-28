import React, { useState } from "react";
import { Zap, Users, Award, Rocket, ArrowRight, CheckCircle, Star, TrendingUp } from "lucide-react"
import { Link, NavLink } from "react-router-dom";

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <Zap className="w-8 h-8 text-primary transform group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">collabit</span>
          </div>
          <div className="flex items-center gap-4">
            <NavLink
              to="/login"
              className="text-muted-foreground hover:text-foreground transition duration-200"
            >
              Login
            </NavLink>
            <NavLink to="/signup" className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white font-medium transition-all duration-200 transform hover:scale-105">
              Get Started
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center space-y-8 relative z-10">
          <div className="inline-block">
            <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">🚀 Welcome to the Future of Collaboration</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
            Pitch. <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">Collaborate.</span> Earn.
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn your brilliant ideas into reality. Connect with talented creators worldwide, build amazing products together, and earn exclusive rewards and learning opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <NavLink to="/signup" className="px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-white font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
              Start Pitching Now
              <ArrowRight className="w-5 h-5" />
            </NavLink>
            <NavLink
              to="/explore"
              className="px-8 py-4 rounded-lg border-2 border-primary/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 font-semibold"
            >
              Explore Pitches
            </NavLink>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 mt-16 border-t border-border/30">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Active Projects</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-accent">2K+</p>
              <p className="text-sm text-muted-foreground">Collaborators</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-secondary">$50K+</p>
              <p className="text-sm text-muted-foreground">Rewards Earned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose collabit?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to pitch ideas, collaborate with teams, and earn rewards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Rocket,
              title: "Launch Your Idea",
              description: "Pitch your project and find the perfect collaborators to bring it to life.",
              color: "primary"
            },
            {
              icon: Users,
              title: "Build Your Team",
              description: "Connect with talented creators and collaborate on multiple exciting projects.",
              color: "accent"
            },
            {
              icon: Award,
              title: "Earn Rewards",
              description: "Get credits and access exclusive courses for every collaboration you complete.",
              color: "secondary"
            },
            {
              icon: Zap,
              title: "Fast & Easy",
              description: "Simple process to pitch, join, and collaborate on projects seamlessly.",
              color: "primary"
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="p-8 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group cursor-pointer backdrop-blur-sm"
              >
                <div className="mb-6 inline-block p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to start your collaboration journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: 1,
              title: "Create Your Pitch",
              description: "Share your innovative idea with the community and describe what you're looking for"
            },
            {
              step: 2,
              title: "Connect with Collaborators",
              description: "Browse talented creators and build the perfect team for your project"
            },
            {
              step: 3,
              title: "Collaborate & Earn",
              description: "Work together, complete milestones, and earn rewards and exclusive courses"
            }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-10"></div>
          <div className="relative p-12 sm:p-16 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators already collaborating and earning on collabit
            </p>
            <NavLink to="/signup" className="px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-white font-semibold transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">collabit</span>
              </div>
              <p className="text-muted-foreground text-sm">Bringing ideas and talent together</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 collabit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
