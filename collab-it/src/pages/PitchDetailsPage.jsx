"use client"
import { useEffect, useState } from "react"
import { ArrowLeft, Users, Award, MessageSquare, Share2, Zap } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import CollaborationRequestModal from "../components/CollaborationRequestModal"
import { pitchService } from "../services/pitchService"
import { userService } from "../services/userService"
import { useAuth } from "../context/AuthContext"

export default function PitchDetailPage() {
  const { id } = useParams()
  const pitchId = Number.parseInt(id)
  const { user } = useAuth()
  const [pitch, setPitch] = useState(null)
  const [ownerDetails, setOwnerDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [joined, setJoined] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showRequestModal, setShowRequestModal] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchPitch = async () => {
      try {
        setLoading(true)
        const data = await pitchService.getPitch(pitchId)
        if (mounted) setPitch(data)

        // Fetch owner details separately
        if (data?.ownerId) {
          const ownerData = await userService.getUserById(data.ownerId)
          if (mounted && ownerData) setOwnerDetails(ownerData)
        }
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load pitch")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (!isNaN(pitchId)) fetchPitch()
    return () => { mounted = false }
  }, [pitchId])

  if (loading) return <div className="min-h-screen bg-background">Loading...</div>
  if (error) return <div className="min-h-screen bg-background">{error}</div>
  if (!pitch) return <div className="min-h-screen bg-background">Pitch not found</div>

  // Check if current user is the pitch owner
  const isOwner = user && (user.id === pitch.ownerId || user.userId === pitch.ownerId)

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
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
                      {(pitch.maxCollaborators ?? 0) - (pitch.collaborators ?? 0)}/{pitch.maxCollaborators ?? 0}
                    </p>
                  </div>
                </div>

                {/* Owner Details */}
                <div className="p-6 bg-card rounded-lg border border-border">
                  <h3 className="text-xl font-bold mb-4">Project Owner</h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={ownerDetails?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(ownerDetails?.fullName || pitch.createdBy || "owner")}`}
                      alt={ownerDetails?.fullName || pitch.createdBy}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-lg">{ownerDetails?.fullName || pitch.createdBy}</p>
                      <p className="text-sm text-muted-foreground">{ownerDetails?.email}</p>
                      {ownerDetails?.bio && <p className="text-sm text-muted-foreground mt-1">{ownerDetails.bio}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "collaborators" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Current Team Members</h2>
                {(pitch.collaboratorsList ?? []).map((collab) => (
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
                {(pitch.requirements ?? []).map((req, idx) => (
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
                    <span className="font-bold text-primary">{pitch.reward?.credits ?? 0} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Courses</span>
                    <span className="font-bold text-accent">{pitch.reward?.courses ?? 0} unlocked</span>
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
                    {pitch.collaborators ?? 0}/{pitch.maxCollaborators ?? 0}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-accent h-2 rounded-full transition-all"
                    style={{ width: `${pitch.maxCollaborators ? ((pitch.collaborators ?? 0) / pitch.maxCollaborators) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Action Button - Only show if user is NOT the owner */}
              {!isOwner && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className={`w-full py-3 rounded-lg font-semibold transition border-2 ${
                    joined
                      ? "bg-muted text-muted-foreground border-muted/50 hover:bg-muted/80"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500 hover:bg-emerald-500/20 hover:border-emerald-600"
                  }`}
                >
                  {joined ? "Already Joined" : "Request to Join"}
                </button>
              )}
              
              {/* Message if user is owner */}
              {isOwner && (
                <div className="w-full py-3 px-4 rounded-lg bg-primary/10 border border-primary/20 text-center text-primary font-semibold">
                  You are the owner of this pitch
                </div>
              )}

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

        {/* Request Modal */}
        {showRequestModal && (
          <CollaborationRequestModal
            pitchId={pitchId}
            onClose={() => setShowRequestModal(false)}
            onSuccess={() => setJoined(true)}
          />
        )}
      </div>
    </div>
  )
}
