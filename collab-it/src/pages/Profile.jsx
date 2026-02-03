import React, { useEffect, useState } from "react";
import image from "../assets/iacsd_logo.jpg";
import { userService } from '../services/userService';
import { s3Service } from '../services/s3Service';
import { useAuth } from '../context/AuthContext';
import AddEducationModal from '../components/AddEducationModal';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [editingSocial, setEditingSocial] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [savingSocial, setSavingSocial] = useState(false);
  const [socialError, setSocialError] = useState(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [profileImageError, setProfileImageError] = useState(null);

  const fetchProfile = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      // prefer fetching the full profile for richer fields
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const targetId = currentUser?.userId || currentUser?.id;
      let p;
      if (targetId) {
        p = await userService.getFullProfile(targetId);
      } else {
        p = await userService.getMyProfile();
      }
      setProfile(p);

      // initialize social links state when fetching own profile
      const viewerId = currentUser?.id || currentUser?.userId;
      if (viewerId && p?.userId && viewerId === p.userId) {
        setSocialLinks(p.socialLinks || []);
      } else {
        setSocialLinks(p.socialLinks || []);
      }

    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated]);

  const avatarSeed = encodeURIComponent(profile?.username || profile?.fullName || 'guest');
  const avatarUrl = profile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfileImage(true);
    setProfileImageError(null);

    try {
      // Upload to S3 and get URL
      const s3Url = await s3Service.uploadFile(file, "profile");

      // Update profile with new image URL
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const userId = currentUser?.id || currentUser?.userId;

      if (!userId) throw new Error("User ID not found");

      await userService.updateMyProfile(userId, {
        ...profile,
        profileImage: s3Url,
      });

      // Update local state
      setProfile((prev) => ({
        ...prev,
        profileImage: s3Url,
      }));

      // Update localStorage
      const updatedUser = { ...currentUser, profileImage: s3Url };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setProfileImageError(err.message || "Failed to upload profile image");
      console.error("Profile image upload error:", err);
    } finally {
      setUploadingProfileImage(false);
    }
  };
    <div className="min-h-screen flex justify-center items-start bg-slate-900 p-6">
      <div className="w-full max-w-2xl">
        {/* Sticky Header */}
        <h1 className="text-4xl font-bold text-white mb-6 sticky top-0 bg-slate-900 py-3 z-10">
          User Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
          {/* Profile Picture */}
          <div className="flex justify-center mb-4 relative">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Profile"
                className="rounded-full w-32 h-32 border border-blue-500 shadow-md object-cover cursor-pointer group-hover:opacity-75 transition"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <span className="text-white text-sm font-semibold">
                  {uploadingProfileImage ? "Uploading..." : "Change"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  disabled={uploadingProfileImage}
                  className="hidden"
                />
              </label>
            </div>
            {profileImageError && (
              <div className="absolute top-32 text-red-400 text-sm">{profileImageError}</div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center text-white">
            <h2 className="text-2xl font-semibold">{profile?.fullName || profile?.username}</h2>
            <p className="">{profile?.college ? `${profile.college}${profile.branch ? ' • ' + profile.branch : ''}` : ''}</p>
            <p className="text-gray-400">{profile?.bio || ''}</p>
          </div> 

          {/* Stats Section */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Credits */}
            <div className="bg-slate-900 p-4 rounded-lg text-white border border-slate-700 text-center">
              <h3 className="text-lg font-semibold mb-1">Credits</h3>
              <p className="text-3xl font-bold">150</p>
            </div>

            {/* Followers */}
            <div className="bg-slate-900 p-4 rounded-lg text-white border border-slate-700 text-center">
              <h3 className="text-lg font-semibold mb-1">Followers</h3>
              <p className="text-3xl font-bold">320</p>
            </div>

            {/* Following */}
            <div className="bg-slate-900 p-4 rounded-lg text-white border border-slate-700 text-center">
              <h3 className="text-lg font-semibold mb-1">Following</h3>
              <p className="text-3xl font-bold">180</p>
            </div>
          </div>

          <div className="skills bg-slate-900 p-4 rounded-lg text-white border border-slate-700 text-center mt-4">
            <h3 className="text-lg font-semibold mb-1">Skills</h3>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((s) => (
                  <span key={s.id || s.name} className="bg-slate-800 px-3 py-1 rounded-full text-sm border border-slate-700">
                    {s.name || s.skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">No skills added yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Profile Details
          </h3>

          <div className="space-y-4">
            {/* Row */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400 text-sm">Email</span>
              <p className="text-white text-base">{profile?.email || '—'}</p>
            </div>

            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400 text-sm">Phone</span>
              <p className="text-white text-base">{profile?.phone || '—'}</p>
            </div>

            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400 text-sm">Bio</span>
              <p className="text-white text-base">{profile?.bio || '—'}</p>
            </div>

            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400 text-sm">Social Links</span>
              <div className="text-right">
                {profile?.socialLinks && profile.socialLinks.length > 0 ? (
                  <div className="flex flex-col items-end">
                    {profile.socialLinks.map((s) => (
                      <a key={s.id || s.platform} href={s.url} target="_blank" rel="noreferrer" className="text-blue-400 text-base hover:underline">{s.platform}: {s.url}</a>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">—</p>
                )}

                {/* show edit button if viewing own profile */}
                {profile?.userId && (JSON.parse(localStorage.getItem('user') || 'null')?.id || JSON.parse(localStorage.getItem('user') || 'null')?.userId) === profile.userId && (
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button onClick={() => setEditingSocial(true)} className="text-sm text-primary hover:underline">Edit</button>
                  </div>
                )}
              </div>
            </div>

            {editingSocial && (
              <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
                <h4 className="text-white font-semibold mb-2">Edit Social Links</h4>
                <div className="space-y-2">
                  {socialLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={link.platform || ''} onChange={(e) => {
                        const next = [...socialLinks]; next[idx] = { ...next[idx], platform: e.target.value }; setSocialLinks(next);
                      }} placeholder="Platform (e.g., Twitter)" className="w-1/3 px-3 py-2 rounded bg-input border border-border" />
                      <input type="url" value={link.url || ''} onChange={(e) => {
                        const next = [...socialLinks]; next[idx] = { ...next[idx], url: e.target.value }; setSocialLinks(next);
                      }} placeholder="https://..." className="flex-1 px-3 py-2 rounded bg-input border border-border" />
                      <button onClick={() => { setSocialError(null); setSocialLinks(socialLinks.filter((_, i) => i !== idx)); }} className="text-red-400">Remove</button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <button onClick={() => setSocialLinks([...socialLinks, { platform: '', url: '' }])} className="text-sm text-primary hover:underline">+ Add Link</button>
                  </div>

                  {socialError && <p className="text-red-400 text-sm">{socialError}</p>}

                  <div className="mt-3 flex gap-2 justify-end">
                    <button onClick={() => { setEditingSocial(false); setSocialError(null); fetchProfile(); }} className="px-4 py-2 rounded border border-slate-700">Cancel</button>
                    <button onClick={async () => {
                      // save with normalization and validation
                      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
                      const userId = currentUser?.id || currentUser?.userId;

                      const normalizePlatform = (p) => {
                        if (!p) return p;
                        const s = p.trim().toLowerCase();
                        if (s.includes('git')) return 'GITHUB';
                        if (s.includes('linkedin')) return 'LINKEDIN';
                        if (s.includes('twitter')) return 'TWITTER';
                        if (s.includes('portfolio') || s.includes('site') || s.includes('website')) return 'PORTFOLIO';
                        return s.toUpperCase();
                      };

                      try {
                        setSavingSocial(true);
                        setSocialError(null);

                        // prepare payload
                        const cleaned = socialLinks
                          .filter(s => s && s.url && s.platform)
                          .map(s => ({ platform: normalizePlatform(s.platform), url: (s.url || '').trim() }));

                        if (cleaned.length === 0) {
                          // allow clearing all links
                          await userService.updateSocialLinks(userId, []);
                          setEditingSocial(false);
                          await fetchProfile();
                          return;
                        }

                        // validate platforms
                        const allowed = ['PORTFOLIO','GITHUB','LINKEDIN','TWITTER'];
                        const invalid = cleaned.find(c => !allowed.includes(c.platform));
                        if (invalid) {
                          setSocialError(`Unknown platform: ${invalid.platform}. Use one of: ${allowed.join(', ')}`);
                          return;
                        }

                        // simple url normalization: ensure scheme exists
                        const withUrls = cleaned.map(c => ({ ...c, url: c.url.match(/^https?:\/\//i) ? c.url : `https://${c.url}` }));

                        await userService.updateSocialLinks(userId, withUrls);
                        setEditingSocial(false);
                        await fetchProfile();
                      } catch (err) {
                        setSocialError(err.message || 'Failed to save social links');
                      } finally { setSavingSocial(false); }
                    }} className="px-4 py-2 rounded bg-primary text-white">{savingSocial ? 'Saving...' : 'Save'}</button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Gender</span>
              <p className="text-white text-base">{profile?.gender || '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Education</h3>

            <button onClick={() => setShowAddEducation(true)} className="text-blue-400 text-sm hover:underline cursor-pointer">+ Add Education</button>
          </div>

          <div className="space-y-6">
          </div>

          <div className="space-y-6">
            {profile?.education && profile.education.length > 0 ? (
              profile.education.map((edu) => (
                <div key={edu.id || edu.institution || edu.institute} className="p-4 bg-slate-900 border border-slate-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <img src={image} alt="Institute Logo" className="w-12 h-12 rounded-md object-contain border border-slate-600 bg-white" />
                      <div>
                        <h4 className="text-lg font-semibold text-white">{edu.institution || edu.college || edu.institute}</h4>
                        <p className="text-slate-400 text-sm">{edu.degree || ''}{edu.field || edu.fieldOfStudy ? `, ${edu.field || edu.fieldOfStudy}` : ''}</p>
                        <p className="text-slate-500 text-xs mt-1">{edu.startYear || ''}{edu.endYear ? ` – ${edu.endYear}` : ''}</p>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17h2M12 4v13m0 0L9 14m3 3l3-3" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-slate-300 text-sm mt-3 leading-relaxed">{edu.description || ''}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No education records available</p>
            )}
          </div>
        </div>

        <AddEducationModal
          isOpen={showAddEducation}
          onClose={() => setShowAddEducation(false)}
          existingEducation={profile?.education || []}
          onSaveSuccess={async () => {
            setShowAddEducation(false);
            await fetchProfile();
          }}
        />
      </div>
    </div>
  );
}
