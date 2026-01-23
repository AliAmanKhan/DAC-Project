import React from "react";
import image from "../assets/iacsd_logo.jpg";
export default function Profile() {
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
          <div className="flex justify-center mb-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="Profile"
              className="rounded-full w-32 h-32 border border-blue-500 shadow-md"
            />
          </div>

          {/* User Info */}
          <div className="text-center text-white">
            <h2 className="text-2xl font-semibold">Prince Acharya</h2>
            <p className="">Software Engineer at BMS</p>
            <p className="text-gray-400">Ajmer, Rajasthan, India</p>
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
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Credits */}
              <div className="bg-slate-900 p-4 rounded-lg text-white border border-slate-700 text-center">
                <h3 className="text-lg font-semibold mb-1">Angular</h3>
              </div>

              {/* Followers */}
              <div className="bg-slate-900 p-4 rounded-lg text-white border border-slate-700 text-center">
                <h3 className="text-lg font-semibold mb-1">React</h3>
              </div>

              {/* Following */}
              <div className="bg-slate-900 p-4 rounded-lg text-white border border-slate-700 text-center">
                <h3 className="text-lg font-semibold mb-1">Node JS</h3>
              </div>
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
              <p className="text-white text-base">aliamankhan96@gmail.com</p>
            </div>

            {/* Row */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400 text-sm">Phone</span>
              <p className="text-white text-base">+91 7357633576</p>
            </div>

            {/* Row */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400 text-sm">Bio</span>
              <p className="text-white text-base">Entrepreneur</p>
            </div>

            {/* Row */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <span className="text-slate-400 text-sm">Social Link</span>
              <p className="text-blue-400 text-base hover:underline cursor-pointer">
                linkedin.com/in/prince-acharya-1234
              </p>
            </div>

            {/* Row */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Gender</span>
              <p className="text-white text-base">Male</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Education</h3>

            <button className="text-blue-400 text-sm hover:underline cursor-pointer">
              + Add Education
            </button>
          </div>

          <div className="space-y-6">
            {/* Education Card */}
            <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg">
              <div className="flex justify-between items-start">
                {/* Left: Logo + Info */}
                <div className="flex gap-4">
                  <img
                    src={image}
                    alt="Institute Logo"
                    className="w-12 h-12 rounded-md object-contain border border-slate-600 bg-white"
                  />

                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Rajkiya Engineering College
                    </h4>

                    <p className="text-slate-400 text-sm">
                      Bachelor of Technology (B.Tech), Computer Science
                    </p>

                    <p className="text-slate-500 text-xs mt-1">
                      2021 – 2025 • Full-time
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                <button className="text-slate-400 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 17h2M12 4v13m0 0L9 14m3 3l3-3"
                    />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Learned computer science fundamentals, participated in
                hackathons and built projects including real-time systems,
                microservices, and full-stack applications.
              </p>
            </div>

            {/* Another Education Card (Example) */}
            <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg">
              <div className="flex gap-4">
                <img
                  src={image}
                  alt="School Logo"
                  className="w-12 h-12 rounded-md object-contain border border-slate-600 bg-white"
                />

                <div>
                  <h4 className="text-lg font-semibold text-white">
                    Kendriya Vidyalaya
                  </h4>

                  <p className="text-slate-400 text-sm">Class 12th – PCM</p>
                  <p className="text-slate-500 text-xs mt-1">2019 – 2021</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
