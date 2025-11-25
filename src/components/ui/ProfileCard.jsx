import React, { useState } from "react";
import { useSelector } from "react-redux";
import Form from "./Form";
import { FaEdit } from "react-icons/fa";
import { getImageSrc } from "../ImageHelper";

const ProfileCard = () => {
  const [OpenEditProfile, setOpenEditProfile] = useState(false);
  const user = useSelector((store) => store.user);
  if (!user) return null;

  const { firstName, lastName, age, about, photo, emailId, skills, gender } =
    user;

  return (
    <>
      {!OpenEditProfile && (
        <div className="relative bg-gradient-to-b from-[#1e293b]/80 to-[#0f172a]/90 backdrop-blur-lg border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl w-[22rem] overflow-hidden text-white">
          {/* Profile banner */}
          <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 via-blue-500/5 to-transparent"></div>

          <div className="p-6 flex flex-col items-center relative z-10">
            <div className="relative">
              <img
                src={getImageSrc(photo)}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-transparent shadow-md transition-all duration-300 hover:border-fuchsia-500"
              />
              <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-center">
              {firstName} {lastName}
            </h2>

            <p className="text-gray-300 text-sm">
              {gender} • {age} yrs
            </p>

            <p className="mt-2 text-gray-400 text-xs break-all">{emailId}</p>

            <p className="mt-3 text-sm text-gray-300 text-center">
              {about || "No bio added yet"}
            </p>

            {skills?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-fuchsia-500 shadow-md hover:scale-105 transition-transform"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <button
              className="mt-6 btn btn-outline btn-primary gap-2 hover:scale-105 transition-transform duration-200"
              onClick={() => setOpenEditProfile(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
      )}

      {OpenEditProfile && (
        <div className="animate-fadeIn">
          <Form setOpenEditProfile={setOpenEditProfile} />
        </div>
      )}
    </>
  );
};

export default ProfileCard;
