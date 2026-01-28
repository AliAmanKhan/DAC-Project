import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, ChevronRight, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    headline: "",
    bio: "",
    skills: [],
    interests: [],
    experience: "beginner",
    avatar: "/placeholder.svg",
  });

  const [errors, setErrors] = useState({});

  const skillsOptions = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Backend Development",
    "Data Science",
    "DevOps",
    "Project Management",
    "Product Design",
    "Marketing",
    "Copywriting",
    "Video Editing",
    "Graphic Design",
  ];

  const interestsOptions = [
    "E-commerce",
    "SaaS",
    "Education",
    "Healthcare",
    "Finance",
    "Entertainment",
    "Social Media",
    "Gaming",
    "AI/ML",
    "Blockchain",
    "IoT",
    "Sustainability",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.headline.trim()) newErrors.headline = "Headline is required";
    if (formData.skills.length === 0) newErrors.skills = "Select at least one skill";
    if (formData.interests.length === 0) {
      newErrors.interests = "Select at least one interest";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      login(formData);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding & Progress */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col items-center justify-center p-8">
          <div className="max-w-md text-center space-y-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-10 h-10 text-primary" />
              <span className="text-3xl font-bold gradient-text">collabit</span>
            </div>
            <h2 className="text-4xl font-bold text-white">
              Join the Collaboration Revolution
            </h2>
            <p className="text-lg text-slate-300">
              Connect with talented creators and bring your ideas to life while earning rewards.
            </p>

            {/* Progress Indicator */}
            <div className="space-y-4 pt-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step < currentStep
                        ? "bg-green-500 text-white"
                        : step === currentStep
                        ? "bg-primary text-white"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {step < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      step <= currentStep ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {step === 1 && "Create Account"}
                    {step === 2 && "Tell Us About Yourself"}
                    {step === 3 && "Get Started"}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-700">
              <p className="text-slate-400">
                Step {currentStep} of 3
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <Zap className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">collabit</span>
            </div>

            {currentStep === 1 && (
              <form className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-slate-300">Get started with your journey</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary outline-none transition"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary outline-none transition"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary outline-none transition"
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary outline-none transition"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>

                <p className="text-center text-slate-300">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-semibold">
                    Login
                  </Link>
                </p>
              </form>
            )}

            {currentStep === 2 && (
              <form className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Tell Us About Yourself
                  </h2>
                  <p className="text-slate-300">Help other creators find you</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleInputChange}
                    placeholder="e.g., Full Stack Developer & Designer"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary outline-none transition"
                  />
                  {errors.headline && (
                    <p className="text-red-400 text-sm mt-1">{errors.headline}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Your Skills {errors.skills && <span className="text-red-400">*</span>}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {skillsOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          formData.skills.includes(skill)
                            ? "bg-primary text-white"
                            : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-primary"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  {errors.skills && (
                    <p className="text-red-400 text-sm mt-1">{errors.skills}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Interests {errors.interests && <span className="text-red-400">*</span>}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {interestsOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          formData.interests.includes(interest)
                            ? "bg-accent text-white"
                            : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-accent"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  {errors.interests && (
                    <p className="text-red-400 text-sm mt-1">{errors.interests}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 px-6 py-3 rounded-lg border border-slate-700 text-white hover:bg-slate-800 transition font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            {currentStep === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">You're All Set!</h2>
                  <p className="text-slate-300">Review your profile before continuing</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Full Name</p>
                    <p className="text-white font-semibold">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-semibold">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Headline</p>
                    <p className="text-white font-semibold">{formData.headline}</p>
                  </div>
                  {formData.bio && (
                    <div>
                      <p className="text-slate-400 text-sm">Bio</p>
                      <p className="text-white">{formData.bio}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 px-6 py-3 rounded-lg border border-slate-700 text-white hover:bg-slate-800 transition font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
