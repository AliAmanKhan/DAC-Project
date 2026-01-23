import React from "react";
// import { LucideIcon } from "lucide-react"

export default function RewardCard({ icon: Icon, label, value }) {
  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <Icon className="w-6 h-6 text-primary mb-2" />
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold gradient-text">{value}</p>
    </div>
  );
}
