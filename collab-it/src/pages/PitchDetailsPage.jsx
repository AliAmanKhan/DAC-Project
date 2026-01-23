"use client"
import { useState } from "react"
import { ArrowLeft, Users, Award, MessageSquare, Share2, Zap } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import Navbar from "../components/NAvbar"

const PITCH_DATA = {
  1: {
    id: 1,
    title: "AI-Powered Note Taking App",
    description:
      "A revolutionary note-taking application that uses artificial intelligence to automatically summarize, tag, and organize your notes. Perfect for students and professionals.",
    category: "Web App",
    status: "Active",
    createdBy: "Sarah Chen",
    collaborators: 3,
    maxCollaborators: 8,
    reward: { credits: 500, courses: 2 },
    image: "/ai-note-taking-app-interface.jpg",
    requirements: ["React Developer", "Backend Engineer", "UI/UX Designer"],
    timeline: "3-4 months",
    description_full: `This is an exciting opportunity to build the future of note-taking. We're looking for talented developers and designers who want to create an AI-powered app that helps millions of users organize their thoughts better.

The app will feature:
- Smart AI summarization
- Automatic tagging and categorization
- Real-time collaboration
- Cross-platform sync
- Advanced search capabilities`,
    collaboratorsList: [
      { id: 1, name: "Alex Johnson", role: "Frontend Developer", avatar: "/diverse-avatars.png" },
      { id: 2, name: "Maria Garcia", role: "Backend Developer", avatar: "/diverse-avatars.png" },
      { id: 3, name: "James Wilson", role: "UI Designer", avatar: "/diverse-avatars.png" },
    ],
  },
}

export default function PitchDetailPage() {
  const params = useParams()
  const pitchId = Number.parseInt(params.id)
  const pitch = PITCH_DATA[1]
  const [joined, setJoined] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  if (!pitch) {
    return <div className="min-h-screen bg-background">Pitch not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <img
              src={pitch.image || "/placeholder.svg"}
              alt={pitch.title}
              className="w-full h-96 object-cover rounded-lg"
            />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                  {pitch.category}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-accent/20 text-accent">
                  {pitch.status}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{pitch.title}</h1>
              <p className="text-lg text-muted-foreground">By {pitch.createdBy}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-4 font-semibold transition ${activeTab === "overview" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("collaborators")}
                  className={`pb-4 font-semibold transition ${activeTab === "collaborators" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                >
                  Team
                </button>
                <button
                  onClick={() => setActiveTab("requirements")}
                  className={`pb-4 font-semibold transition ${activeTab === "requirements" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                >
                  Requirements
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Pitch</h2>
                  <p className="text-foreground whitespace-pre-line">{pitch.description_full}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 p-6 bg-card rounded-lg border border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="text-lg font-semibold">{pitch.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Spots Available</p>
                    <p className="text-lg font-semibold">
                      {pitch.maxCollaborators - pitch.collaborators}/{pitch.maxCollaborators}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "collaborators" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Current Team Members</h2>
                {pitch.collaboratorsList.map((collab) => (
                  <div key={collab.id} className="p-4 bg-card rounded-lg border border-border flex items-center gap-4">
                    <img
                      src={collab.avatar || "/placeholder.svg"}
                      alt={collab.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{collab.name}</p>
                      <p className="text-sm text-muted-foreground">{collab.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "requirements" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Needed Skills</h2>
                {pitch.requirements.map((req, idx) => (
                  <div key={idx} className="p-4 bg-card rounded-lg border border-border flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-medium">{req}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Rewards Card */}
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg border border-primary/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Earn Rewards
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits</span>
                    <span className="font-bold text-primary">{pitch.reward.credits} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Courses</span>
                    <span className="font-bold text-accent">{pitch.reward.courses} unlocked</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6 bg-card rounded-lg border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Team</span>
                  </div>
                  <span className="font-bold">
                    {pitch.collaborators}/{pitch.maxCollaborators}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-accent h-2 rounded-full transition-all"
                    style={{ width: `${(pitch.collaborators / pitch.maxCollaborators) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setJoined(!joined)}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  joined ? "bg-muted text-muted-foreground hover:bg-muted/80" : "btn-primary"
                }`}
              >
                {joined ? "Joined!" : "Join This Pitch"}
              </button>

              {/* Share */}
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 rounded-lg border border-border hover:bg-card transition flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Message
                </button>
                <button className="flex-1 py-2 px-4 rounded-lg border border-border hover:bg-card transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
