import React from "react";
import ProjectsGrid from "../components/ProjectGrid";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "CollabIt – Team Collaboration Platform",
      description:
        "A real-time collaboration tool with chat, shared workspaces, and team management features.",
      tags: ["React", "Node.js", "WebSockets", "MongoDB"],
      photo: "https://picsum.photos/seed/project1/400/250",
    },
    {
      id: 2,
      title: "Streamy Live – Video Streaming App",
      description:
        "A low-latency multi-party video calling app using LiveKit and Redis for signaling.",
      tags: ["LiveKit", "Redis", "React", "Tailwind"],
      photo: "https://picsum.photos/seed/project2/400/250",
    },
    {
      id: 3,
      title: "HMS – Hospital Management System",
      description:
        "Full hospital workflow management with patient records, billing, IPD/OPD modules.",
      tags: ["MERN", "CSFLE", "MongoDB Encryption", "Node.js"],
      photo: "https://picsum.photos/seed/project3/400/250",
    },
    {
      id: 4,
      title: "AppZyra – Software Solutions Website",
      description:
        "Professional portfolio website made with Angular SSR and Firebase Hosting.",
      tags: ["Angular", "Firebase", "SSR", "SEO"],
      photo: "https://picsum.photos/seed/project4/400/250",
    },
    {
      id: 5,
      title: "WeText – Real-time Chat App",
      description:
        "Fast and scalable chat application with group chats, typing indicators, and sockets.",
      tags: ["Socket.IO", "Express", "MongoDB", "JWT"],
      photo: "https://picsum.photos/seed/project5/400/250",
    },
    {
      id: 6,
      title: "E-Commerce Admin Dashboard",
      description:
        "Complete admin dashboard for orders, inventory, payments, revenue analytics.",
      tags: ["React", "Chart.js", "Node.js", "Stripe"],
      photo: "https://picsum.photos/seed/project6/400/250",
    },
    {
      id: 7,
      title: "MediaCloud – Cloud Storage System",
      description:
        "Upload and manage media files with authentication and CDN delivery.",
      tags: ["AWS S3", "Node.js", "Next.js", "Prisma"],
      photo: "https://picsum.photos/seed/project7/400/250",
    },
    {
      id: 8,
      title: "TaskFlow – Workflow Automation Tool",
      description:
        "Automates tasks with triggers, conditions, and integrations with common APIs.",
      tags: ["React", "Redux", "Node.js", "PostgreSQL"],
      photo: "https://picsum.photos/seed/project8/400/250",
    },
    {
      id: 9,
      title: "FinanceTrack – Personal Finance Manager",
      description:
        "Track expenses, create budgets, and view insights with beautiful visual dashboards.",
      tags: ["React", "Recharts", "Firebase", "Tailwind"],
      photo: "https://picsum.photos/seed/project9/400/250",
    },
    {
      id: 10,
      title: "BlogSphere – Modern Blogging Platform",
      description:
        "SEO-friendly blog system with markdown support, drafts, and admin editor.",
      tags: ["Next.js", "MongoDB", "Tailwind", "SSR"],
      photo: "https://picsum.photos/seed/project10/400/250",
    },
  ];

  return (
    <>
      <h2 className="text-white text-2xl font-semibold mb-6 align-middle text-left m-3 pl-2">Your Projects</h2>
      <ProjectsGrid projects={projects} />
    </>
  );
}
