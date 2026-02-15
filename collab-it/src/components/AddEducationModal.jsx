import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

export default function AddEducationModal({ isOpen, onClose, existingEducation = [], onSaveSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setInstitution("");
      setDegree("");
      setFieldOfStudy("");
      setStartYear("");
      setEndYear("");
      setDescription("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please login to add education");
      return;
    }
    if (!institution) {
      setError("Institution is required");
      return;
    }

    const newEdu = {
      institute: institution,
      degree: degree || null,
      field: fieldOfStudy || null,
      startYear: startYear ? parseInt(startYear, 10) : null,
      endYear: endYear ? parseInt(endYear, 10) : null,
      description: description || null,
    };

    const updatedEducation = Array.isArray(existingEducation) ? [...existingEducation, newEdu] : [newEdu];

    try {
      setSaving(true);
      setError(null);
      const userId = user?.id || user?.userId;
      if (!userId) throw new Error("Missing user id");
      await userService.updateEducation(userId, updatedEducation);
      if (onSaveSuccess) onSaveSuccess(updatedEducation);
    } catch (err) {
      setError(err?.message || "Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full mt-1 p-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-xl p-6 z-10 shadow-2xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Add Education</h3>
        {error && <p className="text-sm text-destructive mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Institution *</label>
            <input value={institution} onChange={(e) => setInstitution(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Degree</label>
            <input value={degree} onChange={(e) => setDegree(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Field of Study</label>
            <input value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className={inputClass} />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">Start Year</label>
              <input value={startYear} onChange={(e) => setStartYear(e.target.value)} className={inputClass} type="number" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">End Year</label>
              <input value={endYear} onChange={(e) => setEndYear(e.target.value)} className={inputClass} type="number" />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} rows={3} />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
