import React from "react";
import { Users, Award } from "lucide-react"
import { Link } from "react-router-dom";

export default function PitchCard({ pitch }) {
  return (
    <Link href={`/pitch/${pitch.id}`}>
      <div className="p-4 bg-card rounded-lg border border-border card-hover cursor-pointer h-full flex flex-col">
        <img
          src={pitch.image || "/placeholder.svg"}
          alt={pitch.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />

        <div className="flex-1 space-y-3 flex flex-col">
          <span className="inline-block w-fit px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary">
            {pitch.category}
          </span>

          <h3 className="font-bold text-lg line-clamp-2">{pitch.title}</h3>

          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {pitch.description}
          </p>

          <div className="border-t border-border pt-3 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {pitch.collaborators}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">
                    {pitch.reward.credits} pts
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-primary hover:text-primary/80">
                View →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
