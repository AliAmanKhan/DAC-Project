import React from "react";

export default function ProjectsGrid({ projects }) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-card border border-border rounded-lg shadow-md 
                       hover:shadow-xl hover:border-primary/50 transition-all duration-300 card-hover"
          >
            {/* Image */}
            <div className="h-40 overflow-hidden rounded-t-lg">
              <img
                src={project.photo}
                alt={project.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-foreground text-lg font-semibold mb-2">
                {project.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-primary/20 text-primary 
                               border border-primary/30 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
