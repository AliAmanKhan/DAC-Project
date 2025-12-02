import React, { useState, useRef } from "react";

export default function CreatePitch({ currentUser, onCreate }) {
  const [title, setTitle] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef(null);

  // Handle basic formatting using document.execCommand (simple but works)
  const handleFormat = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, null);
    const html = editorRef.current.innerHTML;
    setDescriptionHtml(html);
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    setDescriptionHtml(editorRef.current.innerHTML);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageFile(file);
    const url = URL.createObjectURL(file);
    setCoverImagePreview(url);
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !descriptionHtml.trim()) {
      alert("Title and description are required.");
      return;
    }

    setIsSubmitting(true);

    const pitch = {
      id: crypto.randomUUID(),
      title: title.trim(),
      descriptionHtml,
      skills,
      coverImageFile, // file object (for upload later)
      coverImagePreview, // local preview URL
      authorId: currentUser?.id ?? null,
      authorImage: currentUser?.avatar ?? null,
      authorName: currentUser?.name ?? "Unknown",
      createdAt: new Date().toISOString(),
    };

    // Call parent handler
    onCreate?.(pitch);

    // Reset form
    setTitle("");
    setDescriptionHtml("");
    setSkills([]);
    setSkillInput("");
    setCoverImageFile(null);
    setCoverImagePreview(null);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-900/80 border border-slate-700 rounded-xl shadow-xl p-5 md:p-6 mt-6">
      {/* Header: Avatar + title */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={currentUser?.avatar}
          alt={currentUser?.name}
          className="h-10 w-10 rounded-full object-cover border border-slate-600"
        />
        <div>
          <p className="text-sm text-slate-300">
            Creating pitch as{" "}
            <span className="font-semibold text-white">
              {currentUser?.name ?? "Guest"}
            </span>
          </p>
          <p className="text-xs text-slate-500">
            Pitches will later be attached to projects
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cover image */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Cover Image
          </label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center px-3 py-2 rounded-lg border border-slate-600 text-sm text-slate-200 bg-slate-800/60 cursor-pointer hover:border-blue-500 hover:text-blue-300 transition">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <span>Upload image</span>
            </label>
            {coverImagePreview && (
              <img
                src={coverImagePreview}
                alt="Cover preview"
                className="h-16 w-24 rounded-md object-cover border border-slate-700"
              />
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Recommended landscape image (e.g., 1200x630).
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Pitch Title
          </label>
          <input
            type="text"
            value={title}
            maxLength={120}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Real-time Collaboration Platform for Remote Teams"
          />
          <div className="text-xs text-slate-500 mt-1 text-right">
            {title.length}/120
          </div>
        </div>

        {/* Description editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-200">
              Description
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleFormat("bold")}
                className="px-2 py-1 text-xs border border-slate-700 rounded bg-slate-800/60 text-slate-200 hover:border-blue-500 hover:text-blue-300"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => handleFormat("italic")}
                className="px-2 py-1 text-xs border border-slate-700 rounded bg-slate-800/60 text-slate-200 hover:border-blue-500 hover:text-blue-300"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => handleFormat("underline")}
                className="px-2 py-1 text-xs border border-slate-700 rounded bg-slate-800/60 text-slate-200 hover:border-blue-500 hover:text-blue-300"
              >
                U
              </button>
            </div>
          </div>

          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            className="min-h-[140px] max-h-80 overflow-y-auto rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your pitch: problem, solution, tech stack, impact..."
            suppressContentEditableWarning
          ></div>

          <p className="mt-1 text-xs text-slate-500">
            Use the toolbar to format text. This is stored as HTML.
          </p>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Skills / Technologies
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className="flex-1 rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., React, Node.js, WebSockets"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.length === 0 && (
              <p className="text-xs text-slate-500">
                Add at least 3–5 relevant skills.
              </p>
            )}
            {skills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-800/60 text-blue-100 text-xs border border-blue-700 hover:border-red-500 hover:text-red-200"
              >
                <span>{skill}</span>
                <span className="text-[10px]">✕</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              // simple reset
              setTitle("");
              setDescriptionHtml("");
              setSkills([]);
              setSkillInput("");
              setCoverImageFile(null);
              setCoverImagePreview(null);
              if (editorRef.current) editorRef.current.innerHTML = "";
            }}
            className="px-4 py-2 text-sm rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800/70"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Pitch"}
          </button>
        </div>
      </form>
    </div>
  );
}
