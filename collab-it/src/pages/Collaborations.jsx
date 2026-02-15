import React, { useState } from "react";
import { Users, Calendar, Award, Filter, Search } from "lucide-react";

export default function Collaborations() {
  const [collaborations] = useState([
    {
      id: 1,
      title: "AI-Powered Note Taking App",
      description: "A smart note-taking application with AI summarization",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      role: "Frontend Developer",
      teammates: [
        { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg" },
        { id: 2, name: "Bob Smith", avatar: "/placeholder.svg" },
        { id: 3, name: "Carol White", avatar: "/placeholder.svg" },
      ],
      progress: 75,
      reward: { credits: 500, courses: 2 },
      image: "/ai-note-taking-app-interface.jpg",
    },
    {
      id: 2,
      title: "Mobile Fitness Tracker",
      description: "Cross-platform fitness tracking app with social features",
      status: "active",
      startDate: "2024-02-20",
      endDate: "2024-08-20",
      role: "Full Stack Developer",
      teammates: [
        { id: 4, name: "David Brown", avatar: "/placeholder.svg" },
        { id: 5, name: "Eve Davis", avatar: "/placeholder.svg" },
      ],
      progress: 85,
      reward: { credits: 750, courses: 3 },
      image: "/fitness-tracking-dashboard.png",
    },
    {
      id: 3,
      title: "E-commerce Analytics Platform",
      description: "Real-time analytics dashboard for online store owners",
      status: "completed",
      startDate: "2023-10-01",
      endDate: "2024-01-01",
      role: "Backend Developer",
      teammates: [
        { id: 6, name: "Frank Wilson", avatar: "/placeholder.svg" },
      ],
      progress: 100,
      reward: { credits: 600, courses: 2 },
      image: "/analytics-dashboard-ecommerce.jpg",
    },
    {
      id: 4,
      title: "Community Learning Hub",
      description: "Peer-to-peer learning platform with gamification",
      status: "active",
      startDate: "2024-03-10",
      endDate: "2024-09-10",
      role: "UI/UX Designer",
      teammates: [
        { id: 7, name: "Grace Lee", avatar: "/placeholder.svg" },
        { id: 8, name: "Henry Chen", avatar: "/placeholder.svg" },
        { id: 9, name: "Iris Martinez", avatar: "/placeholder.svg" },
        { id: 10, name: "Jack Taylor", avatar: "/placeholder.svg" },
      ],
      progress: 60,
      reward: { credits: 800, courses: 4 },
      image: "/learning-platform-community.jpg",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCollaborations = collaborations.filter((collab) => {
    const matchesStatus =
      filterStatus === "all" || collab.status === filterStatus;
    const matchesSearch =
      collab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCount = collaborations.filter(
    (c) => c.status === "active"
  ).length;
  const completedCount = collaborations.filter(
    (c) => c.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-card to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Users className="w-10 h-10 text-primary" />
                My Collaborations
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your ongoing and completed projects
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-primary">{activeCount}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-400">{completedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search collaborations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary outline-none transition"
            />
          </div>
          <div className="flex gap-2">
            {[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Completed", value: "completed" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  filterStatus === filter.value
                    ? "bg-primary text-white"
                    : "bg-card border border-border hover:border-primary"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collaborations List */}
        <div className="space-y-6">
          {filteredCollaborations.length > 0 ? (
            filteredCollaborations.map((collab) => (
              <div
                key={collab.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <img
                      src={collab.image || "/placeholder.svg"}
                      alt={collab.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Info */}
                  <div className="md:col-span-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold">{collab.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            collab.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {collab.status.charAt(0).toUpperCase() +
                            collab.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {collab.description}
                      </p>

                      {/* Role */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                          {collab.role}
                        </span>
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(collab.startDate).toLocaleDateString()} -{" "}
                          {new Date(collab.endDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {collab.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-full transition-all rounded-full shadow-lg shadow-primary/50"
                            style={{ width: `${collab.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Teammates */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">
                          Team ({collab.teammates.length})
                        </p>
                        <div className="flex -space-x-2">
                          {collab.teammates.map((teammate) => (
                            <div
                              key={teammate.id}
                              className="relative group"
                              title={teammate.name}
                            >
                              <img
                                src={teammate.avatar}
                                alt={teammate.name}
                                className="w-8 h-8 rounded-full bg-primary/40 border-2 border-card hover:border-primary transition"
                              />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-card border border-border text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                                {teammate.name}
                              </div>
                            </div>
                          ))}
                          {collab.teammates.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-primary/60 border-2 border-card flex items-center justify-center text-xs font-bold text-white">
                              +{collab.teammates.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center gap-6 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Credits Earned
                          </p>
                          <p className="font-bold text-accent">
                            {collab.reward.credits}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Courses Unlocked
                          </p>
                          <p className="font-bold text-primary">
                            {collab.reward.courses}
                          </p>
                        </div>
                      </div>
                      <button className="ml-auto px-6 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                No collaborations found
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
