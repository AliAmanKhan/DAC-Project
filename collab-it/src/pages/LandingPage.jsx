import React from "react";
import { Zap, Users, Award, Rocket } from "lucide-react"
import { Link, NavLink } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">collabit</span>
          </div>
          <div className="flex items-center gap-4">
            <NavLink
              to="/login"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Login
            </NavLink>
            <NavLink href="/signup" className="btn-primary">
              Get Started
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight">
            Pitch. <span className="gradient-text">Collaborate.</span> Earn.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your project ideas, connect with talented collaborators, and
            earn credits & exclusive courses while building amazing things
            together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <NavLink href="/signup" className="btn-primary">
              Start Pitching Now
            </NavLink>
            <NavLink
              href="/explore"
              className="px-6 py-3 rounded-lg border border-border hover:bg-card transition-all duration-200"
            >
              Explore Pitches
            </NavLink>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg bg-card border border-border card-hover">
            <Rocket className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Launch Your Idea</h3>
            <p className="text-muted-foreground">
              Pitch your project and find the perfect collaborators to bring it
              to life.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border card-hover">
            <Users className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-lg font-semibold mb-2">Build Your Team</h3>
            <p className="text-muted-foreground">
              Connect with talented creators and collaborate on multiple
              exciting projects.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border card-hover">
            <Award className="w-10 h-10 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Earn Rewards</h3>
            <p className="text-muted-foreground">
              Get credits and access exclusive courses for every collaboration
              you complete.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border card-hover">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fast & Easy</h3>
            <p className="text-muted-foreground">
              Simple process to pitch, join, and collaborate on projects
              seamlessly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
