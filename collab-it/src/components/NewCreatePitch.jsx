import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"

export default function NewCreatePitch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web App",
    skills: "",
    timeline: "3 months",
    maxCollaborators: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle pitch creation
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Create a New Pitch</h1>
          <p className="text-lg text-muted-foreground">
            Share your project idea and find the right collaborators
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="p-8 bg-card rounded-lg border border-border space-y-6">
            <h2 className="text-2xl font-bold">Project Details</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., AI-Powered Note Taking App"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project idea, what problem it solves, and your vision..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
                >
                  <option value="Web App">Web App</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Design">Design Project</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
                >
                  <option value="1 month">1 month</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Collaboration Details */}
          <div className="p-8 bg-card rounded-lg border border-border space-y-6">
            <h2 className="text-2xl font-bold">Team Requirements</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Required Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React Developer, Backend Engineer, UI Designer"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Maximum Collaborators
              </label>
              <input
                type="number"
                name="maxCollaborators"
                value={formData.maxCollaborators}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              Launch Pitch
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-lg border border-border hover:bg-card transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
