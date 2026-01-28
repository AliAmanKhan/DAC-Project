import React, { useState } from "react";
import { Plus, Zap, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import RewardCard from "../components/RewardCard";
import PitchCard from "../components/PitchCard";

export default function Dashboard() {
  const [pitches] = useState([
    {
      id: 1,
      title: "AI-Powered Note Taking App",
      description:
        "A smart note-taking application with AI summarization and tagging",
      category: "Web App",
      collaborators: 3,
      reward: { credits: 500, courses: 2 },
      image: "/ai-note-taking-app-interface.jpg",
    },
    {
      id: 2,
      title: "Mobile Fitness Tracker",
      description: "Cross-platform fitness tracking app with social features",
      category: "Mobile App",
      collaborators: 5,
      reward: { credits: 750, courses: 3 },
      image: "/fitness-tracking-dashboard.png",
    },
    {
      id: 3,
      title: "E-commerce Analytics Platform",
      description: "Real-time analytics dashboard for online store owners",
      category: "SaaS",
      collaborators: 2,
      reward: { credits: 600, courses: 2 },
      image: "/analytics-dashboard-ecommerce.jpg",
    },
    {
      id: 4,
      title: "Community Learning Hub",
      description: "Peer-to-peer learning platform with gamification",
      category: "Education",
      collaborators: 4,
      reward: { credits: 800, courses: 4 },
      image: "/learning-platform-community.jpg",
    },
  ]);
  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-card to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome Back, Creator
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Explore amazing projects to collaborate on and earn rewards
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/create-pitch" className="btn-primary">
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create a Pitch
                </Link>
                <Link to="/collaborations" className="px-6 py-3 rounded-lg border border-border hover:bg-card transition-all duration-200">
                  My Collaborations
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <RewardCard icon={Zap} label="Credits Earned" value="2,450" />
              <RewardCard icon={BookOpen} label="Courses Unlocked" value="8" />
              <RewardCard icon={TrendingUp} label="Active Pitches" value="3" />
              <RewardCard icon={Plus} label="Collaborations" value="12" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pitches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Featured Pitches</h2>
          <p className="text-muted-foreground text-lg">
            Discover exciting projects looking for collaborators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pitches.map((pitch) => (
            <PitchCard key={pitch.id} pitch={pitch} />
          ))}
        </div>
      </section>

      {/* Recommended For You */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Recommended For You</h2>
          <p className="text-muted-foreground text-lg">
            Based on your interests and skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pitches.slice(0, 2).map((pitch) => (
            <div
              key={pitch.id}
              className="p-6 rounded-lg bg-card border border-border card-hover"
            >
              <img
                src={pitch.image || "/placeholder.svg"}
                alt={pitch.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                  {pitch.category}
                </span>
                <h3 className="text-xl font-bold">{pitch.title}</h3>
                <p className="text-muted-foreground">{pitch.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Collaborators
                      </p>
                      <p className="font-bold text-primary">
                        {pitch.collaborators}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Reward</p>
                      <p className="font-bold text-accent">
                        {pitch.reward.credits} pts
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/pitch/${pitch.id}`}
                    className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
