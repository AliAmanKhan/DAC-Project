import React, { useEffect, useState } from "react";
import { pitchService } from "../services/pitchService";
import PitchCard from "../components/PitchCard";
import { Link } from "react-router-dom";

export default function MyPitches() {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPitches = async () => {
      try {
        setLoading(true);
        const data = await pitchService.getMyPitches();
        if (mounted) setPitches(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load pitches");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPitches();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Pitches</h1>
          <Link to="/create" className="btn-primary">Create Pitch</Link>
        </div>

        {loading && <p className="text-muted-foreground">Loading pitches...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {!loading && pitches.length === 0 && (
          <div className="p-6 bg-card rounded-lg border border-border text-center">
            <p className="text-muted-foreground">You haven't created any pitches yet.</p>
            <Link to="/create" className="mt-4 inline-block btn-primary">Create your first pitch</Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {pitches.map((pitch) => (
            <PitchCard key={pitch.id || pitch.pitchId} pitch={{
              id: pitch.id || pitch.pitchId,
              title: pitch.title,
              description: pitch.description,
              image: pitch.image,
              category: pitch.tags || pitch.category || "",
              collaborators: pitch.collaborators || 0,
              reward: pitch.reward || { credits: 0 }
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
