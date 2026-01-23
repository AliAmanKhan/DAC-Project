import React, { useState } from "react";
import { Plus, Users, Mail, Trash2, CheckCircle, Clock } from "lucide-react";

export default function Team() {
  const [teamMembers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Project Lead",
      status: "active",
      joinDate: "2024-01-15",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "Developer",
      status: "active",
      joinDate: "2024-02-20",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Carol White",
      email: "carol@example.com",
      role: "Designer",
      status: "pending",
      joinDate: "2024-03-10",
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      name: "David Brown",
      email: "david@example.com",
      role: "Collaborator",
      status: "active",
      joinDate: "2024-01-05",
      avatar: "/placeholder.svg",
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = (e) => {
    e.preventDefault();
    // Handle invite logic
    console.log("Inviting:", inviteEmail);
    setInviteEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-card to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Users className="w-10 h-10 text-primary" />
                Team Management
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your team members and collaborators
              </p>
            </div>
            <button className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invite Section */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Send Invite</h2>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-medium"
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Send Invite
                </button>
              </form>

              {/* Stats */}
              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-3xl font-bold text-primary">3</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-muted-foreground">Pending Invites</p>
                  <p className="text-3xl font-bold text-accent">1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Team Members ({teamMembers.length})</h2>

              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full bg-primary/20"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold">{member.name}</h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              member.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {member.status === "active" ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {member.status.charAt(0).toUpperCase() +
                              member.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="px-2 py-1 rounded bg-primary/20 text-primary">
                            {member.role}
                          </span>
                          <span className="text-muted-foreground">
                            Joined {member.joinDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
