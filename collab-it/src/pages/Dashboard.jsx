import React, { useState, useEffect } from "react";
import { Plus, Zap, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import RewardCard from "../components/RewardCard";
import PitchCard from "../components/PitchCard";
import { useAuth } from "../context/AuthContext";
import { pitchService } from "../services/pitchService";

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

  // Helper component placed inline for clarity (declared inside component scope)
  function RecommendedList({ pitches = [] }) {
    const initial = pitches;
    const { user } = useAuth();
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      let mounted = true;
      const fetchRecommended = async () => {
        setLoading(true);
        setError(null);
        try {
          const interests = user?.interests || [];
          const results = await pitchService.getRecommendedPitches(interests, 6);
          if (!mounted) return;
          setRecommended(results || []);
        } catch (err) {
          if (!mounted) return;
          setError(err.message || "Failed to load recommendations");
          setRecommended([]);
        } finally {
          if (mounted) setLoading(false);
        }
      };

      fetchRecommended();
      return () => (mounted = false);
    }, [user]);

    if (loading) {
      return <div className="text-muted-foreground">Loading recommendations...</div>;
    }
    if (error) {
      return <div className="text-red-400">{error}</div>;
    }
    if (recommended.length === 0) {
      return <div className="text-muted-foreground text-lg">There are no pitches</div>;
    }

    const list = recommended;

    return (
      <>
        {list.map((pitch) => {
          // map backend fields to UI-friendly props
          const title = pitch.title || pitch.name;
          const description = pitch.description || "";
          const image = pitch.image || "/placeholder.svg";
          const tags = pitch.tags || "";
          const category = (tags && tags.split(",")[0]) || "General";
          const collaborators = pitch.requiredCollaborators ?? "—";
          const viewUrl = `/pitch/${pitch.pitchId ?? pitch.id}`;

          return (
            <div
              key={pitch.pitchId ?? pitch.id}
              className="p-6 rounded-lg bg-card border border-border card-hover"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                  {category}
                </span>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Collaborators</p>
                      <p className="font-bold text-primary">{collaborators}</p>
                    </div>
                  </div>
                  <Link
                    to={viewUrl}
                    className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }
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
                <Link to="/create-pitch" className="btn-primary">
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
          {/* Recommended pitches fetched from API */}
          {/** Loading / Error / Empty states handled below **/}
          <RecommendedList pitches={pitches /* fallback until fetched */} />
        </div>
      </section>
    </div>
  );
}


