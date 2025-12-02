import React from "react";

export default function ProjectsGrid({ projects }) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-blue-800/40 border border-blue-700 rounded-lg shadow-md 
                       hover:shadow-blue-900/40 hover:border-blue-500 transition-all duration-300"
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
              <h3 className="text-white text-lg font-semibold mb-2">
                {project.title}
              </h3>

              <p className="text-slate-300 text-sm mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-700/60 text-blue-200 
                               border border-blue-600 rounded-full"
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
