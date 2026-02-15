import React, { useEffect, useState } from "react";
import image from "../assets/iacsd_logo.jpg";
import { userService } from '../services/userService';
import { s3Service } from '../services/s3Service';
import { useAuth } from '../context/AuthContext';
import AddEducationModal from '../components/AddEducationModal';

import { Camera, Github, Linkedin, Twitter, Globe, Link as LinkIcon, Edit2, X, Check } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, updateUser, refreshUserProfile } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [editingSocial, setEditingSocial] = useState(false);
  const [socialForm, setSocialForm] = useState({
    GITHUB: "",
    LINKEDIN: "",
    TWITTER: "",
    PORTFOLIO: ""
  });
  const [savingSocial, setSavingSocial] = useState(false);
  const [socialError, setSocialError] = useState(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [profileImageError, setProfileImageError] = useState(null);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  const fetchProfile = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      // prefer fetching the full profile for richer fields
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const targetId = currentUser?.userId || currentUser?.id;
      let p;
      if (targetId) {
        console.log("Target id found");
        p = await userService.getFullProfile(targetId);
      } else {
        console.log("No target id found");
        p = await userService.getMyProfile();
      }
      setProfile(p);

      // initialize social links form state when fetching own profile
      if (p?.socialLinks) {
        const form = {
          GITHUB: "",
          LINKEDIN: "",
          TWITTER: "",
          PORTFOLIO: ""
        };
        p.socialLinks.forEach(link => {
          if (link.platform && form.hasOwnProperty(link.platform)) {
            form[link.platform] = link.url;
          }
        });
        setSocialForm(form);
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
      console.log("Uploaded S3 URL:", s3Url);
      console.log("Current Profile State:", profile);

      // Update profile with new image URL
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      const userId = currentUser?.id || currentUser?.userId;

      if (!userId) throw new Error("User ID not found");

      // Create a clean payload with only allowed fields
      const payload = {
        fullName: profile.fullName,
        bio: profile.bio,
        dob: profile.dob,
        gender: profile.gender,
        profileImage: s3Url,
        college: profile.college,
        branch: profile.branch,
        graduationYear: profile.graduationYear,
        visibility: profile.visibility || "PUBLIC"
      };

      await userService.updateMyProfile(userId, payload);

      // Update local state
      setProfile((prev) => ({
        ...prev,
        profileImage: s3Url,
      }));

      // Update localStorage
      const updatedUser = { ...currentUser, profileImage: s3Url };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Sync global auth state (updates Header immediately)
      if (updateUser) {
        updateUser((prev) => ({ ...prev, profileImage: s3Url }));
      }
    } catch (err) {
      setProfileImageError(err.message || "Failed to upload profile image");
      console.error("Profile image upload error:", err);
    } finally {
      setUploadingProfileImage(false);
    }
  };

  return (
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
                {uploadingProfileImage ? (
                  <span className="text-white text-sm font-semibold">Uploading...</span>
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
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
              {editingPhone ? (
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm w-32 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter phone"
                  />
                  <button
                    onClick={async () => {
                       try {
                         const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
                         const userId = currentUser?.id || currentUser?.userId;
                         
                         const payload = {
                           fullName: profile.fullName,
                           bio: profile.bio,
                           dob: profile.dob,
                           gender: profile.gender,
                           profileImage: profile.profileImage,
                           college: profile.college,
                           branch: profile.branch,
                           graduationYear: profile.graduationYear,
                           visibility: profile.visibility || "PUBLIC",
                           phone: phoneInput
                         };

                         await userService.updateMyProfile(userId, payload);
                         setProfile(prev => ({ ...prev, phone: phoneInput }));
                         setEditingPhone(false);
                         await fetchProfile(); // refresh to be sure
                       } catch (err) {
                         console.error("Failed to update phone:", err);
                         // optionally set error state
                       }
                    }}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingPhone(false)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <p className="text-white text-base">{profile?.phone || '—'}</p>
                  {/* show edit button if viewing own profile */}
                  {profile?.userId && (JSON.parse(localStorage.getItem('user') || 'null')?.id || JSON.parse(localStorage.getItem('user') || 'null')?.userId) === profile.userId && (
                    <button 
                      onClick={() => { setPhoneInput(profile?.phone || ""); setEditingPhone(true); }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-400 transition-all"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400 text-sm">Bio</span>
              <p className="text-white text-base">{profile?.bio || '—'}</p>
            </div>

            <div className="flex justify-between items-start border-b border-slate-700 pb-4">
              <span className="text-slate-400 text-sm w-32 shrink-0 pt-2">Social Links</span>
              <div className="flex-1">
                {!editingSocial ? (
                  <div className="flex flex-col items-end gap-3">
                    {profile?.socialLinks && profile.socialLinks.length > 0 ? (
                      profile.socialLinks.map((s) => {
                        const Icon = s.platform === 'GITHUB' ? Github :
                                     s.platform === 'LINKEDIN' ? Linkedin :
                                     s.platform === 'TWITTER' ? Twitter : Globe;
                        return (
                          <a 
                            key={s.id || s.platform} 
                            href={s.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                          >
                            <span className="text-sm font-medium group-hover:underline">{s.platform === 'PORTFOLIO' ? 'Portfolio' : s.platform.charAt(0) + s.platform.slice(1).toLowerCase()}</span>
                            <Icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                          </a>
                        );
                      })
                    ) : (
                      <p className="text-slate-500 text-sm italic">No links added</p>
                    )}

                    {/* Show edit button if viewing own profile */}
                    {profile?.userId && (JSON.parse(localStorage.getItem('user') || 'null')?.id || JSON.parse(localStorage.getItem('user') || 'null')?.userId) === profile.userId && (
                      <button 
                        onClick={() => setEditingSocial(true)} 
                        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800/50"
                      >
                        <Edit2 className="w-3 h-3" /> Edit Links
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Edit Social Links</h4>
                      <button onClick={() => { setEditingSocial(false); setSocialError(null); fetchProfile(); }} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* GitHub */}
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Github className="h-5 w-5 text-slate-500 group-focus-within/input:text-white transition-colors" />
                        </div>
                        <input
                          type="url"
                          value={socialForm.GITHUB}
                          onChange={(e) => setSocialForm({ ...socialForm, GITHUB: e.target.value })}
                          className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-500 text-sm transition-all shadow-sm"
                          placeholder="https://github.com/username"
                        />
                      </div>

                      {/* LinkedIn */}
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Linkedin className="h-5 w-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                        </div>
                        <input
                          type="url"
                          value={socialForm.LINKEDIN}
                          onChange={(e) => setSocialForm({ ...socialForm, LINKEDIN: e.target.value })}
                          className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-500 text-sm transition-all shadow-sm"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>

                      {/* Twitter */}
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Twitter className="h-5 w-5 text-slate-500 group-focus-within/input:text-sky-400 transition-colors" />
                        </div>
                        <input
                          type="url"
                          value={socialForm.TWITTER}
                          onChange={(e) => setSocialForm({ ...socialForm, TWITTER: e.target.value })}
                          className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-500 text-sm transition-all shadow-sm"
                          placeholder="https://twitter.com/username"
                        />
                      </div>

                      {/* Portfolio */}
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                        </div>
                        <input
                          type="url"
                          value={socialForm.PORTFOLIO}
                          onChange={(e) => setSocialForm({ ...socialForm, PORTFOLIO: e.target.value })}
                          className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-500 text-sm transition-all shadow-sm"
                          placeholder="https://your-portfolio.com"
                        />
                      </div>

                      {socialError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                           <span className="block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                           {socialError}
                        </div>
                      )}

                      <div className="pt-2 flex justify-end gap-3">
                        <button 
                          onClick={() => { setEditingSocial(false); setSocialError(null); fetchProfile(); }} 
                          className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={async () => {
                            const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
                            const userId = currentUser?.id || currentUser?.userId;

                            try {
                              setSavingSocial(true);
                              setSocialError(null);

                              // Prepare payload from form state
                              const links = Object.entries(socialForm)
                                .filter(([_, url]) => url && url.trim().length > 0)
                                .map(([platform, url]) => ({
                                  platform,
                                  url: url.trim().match(/^https?:\/\//i) ? url.trim() : `https://${url.trim()}`
                                }));

                              await userService.updateSocialLinks(userId, links);
                              setEditingSocial(false);
                              await fetchProfile();
                            } catch (err) {
                              setSocialError(err.message || 'Failed to save social links');
                            } finally { setSavingSocial(false); }
                          }} 
                          disabled={savingSocial}
                          className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {savingSocial ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                          {savingSocial ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
