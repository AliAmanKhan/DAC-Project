import React, { useState } from "react";
import { TrendingUp, Users, Award, Clock, Calendar, Download } from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("month");

  const stats = [
    {
      label: "Total Collaborations",
      value: "24",
      change: "+12%",
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Points Earned",
      value: "3,250",
      change: "+8%",
      icon: Award,
      color: "text-yellow-400",
    },
    {
      label: "Active Projects",
      value: "6",
      change: "+2",
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      label: "Avg Response Time",
      value: "2.4h",
      change: "-15%",
      icon: Clock,
      color: "text-purple-400",
    },
  ];

  const projectMetrics = [
    {
      name: "AI-Powered Note Taking App",
      collaborators: 8,
      pointsEarned: 450,
      status: "Active",
      progress: 65,
    },
    {
      name: "Mobile Fitness Tracker",
      collaborators: 12,
      pointsEarned: 680,
      status: "Active",
      progress: 85,
    },
    {
      name: "E-commerce Analytics Platform",
      collaborators: 5,
      pointsEarned: 520,
      status: "Completed",
      progress: 100,
    },
    {
      name: "Community Learning Hub",
      collaborators: 10,
      pointsEarned: 600,
      status: "Active",
      progress: 72,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-card to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <TrendingUp className="w-10 h-10 text-primary" />
                Analytics
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your performance and collaboration metrics
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2">
              {["week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    timeRange === range
                      ? "bg-primary text-white"
                      : "bg-card border border-border hover:border-primary"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-sm font-medium text-green-400">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Chart Placeholder 1 */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-xl font-bold mb-6">Collaboration Trend</h3>
            <div className="h-64 flex items-end justify-around gap-2 bg-primary/5 rounded-lg p-4">
              {[40, 60, 75, 65, 80, 90, 85].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Chart Placeholder 2 */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-xl font-bold mb-6">Points Distribution</h3>
            <div className="space-y-4">
              {[
                { label: "Projects", value: 45 },
                { label: "Collaborations", value: 30 },
                { label: "Reviews", value: 15 },
                { label: "Milestones", value: 10 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Metrics */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Project Performance</h3>
            <button className="px-4 py-2 rounded-lg border border-border hover:bg-primary/10 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Project Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Collaborators
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Points Earned
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Progress
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {projectMetrics.map((project, index) => (
                  <tr key={index} className="border-b border-border hover:bg-primary/5 transition">
                    <td className="py-4 px-4">{project.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(project.collaborators, 3) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-primary/40 border-2 border-background flex items-center justify-center text-xs font-bold"
                          >
                            {i + 1}
                          </div>
                        ))}
                        {project.collaborators > 3 && (
                          <div className="w-8 h-8 rounded-full bg-primary/60 border-2 border-background flex items-center justify-center text-xs font-bold">
                            +{project.collaborators - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold">{project.pointsEarned}</td>
                    <td className="py-4 px-4">
                      <div className="w-32 h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        {project.progress}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
