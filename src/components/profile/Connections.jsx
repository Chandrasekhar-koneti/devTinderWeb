import axios from "axios";
import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setConnections } from "../../redux/slices/connectionSlice";
import useProfile from "../../CustomHooks/useProfile";
import { useNavigate } from "react-router-dom";
import Nodata from "../../Lotties/Nodata.json";
import Lottie from "lottie-react";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import { getImageSrc } from "../ImageHelper";

const Connections = () => {
  const dispatch = useDispatch();
  const connectionsData = useSelector(
    (store) => store?.connections?.connections
  );
  const { profile } = useProfile();
  const navigate = useNavigate();

  const connectionsReq = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/connections`,
        {
          withCredentials: true,
        }
      );
      profile();
      dispatch(setConnections(response.data.data));
    } catch (err) {
      if (err.response?.data?.err === "Token is not valid") {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    connectionsReq();
  }, []);

  if (!connectionsData?.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <Lottie
          animationData={JSON.parse(JSON.stringify(Nodata))}
          loop
          autoplay
          className="w-[250px] h-[250px]"
        />
        <p className="text-gray-400 text-lg font-semibold mt-2">
          You don’t have any connections yet.
        </p>
        <p className="text-gray-500 text-sm">
          Start swiping to find your first match!
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-10 px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center items-center gap-2 mb-2">
          <FaUserFriends className="text-primary text-3xl animate-bounce" />
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Your Connections
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          People you’ve matched or connected with 💫
        </p>
      </div>

      {/* Connections Grid */}
      <div
        className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ${
          connectionsData?.length <= 2
            ? "justify-center lg:place-items-center"
            : ""
        }`}
      >
        {connectionsData?.map((person) => (
          <div
            key={person._id}
            className="group relative card bg-white/5 border border-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl 
                       hover:border-primary/50 transition-all duration-300 p-6 rounded-3xl"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={getImageSrc(person.photo)}
                  alt={person.firstName}
                  className="rounded-full w-24 h-24 object-cover border-4 border-transparent group-hover:border-primary transition-all duration-500"
                />
                <span className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-gray-900 shadow-md"></span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-white flex items-center gap-1">
                {person.firstName} {person.lastName}
                <MdOutlineWavingHand className="text-yellow-400 animate-wiggle" />
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                {person.gender} • {person.age} yrs
              </p>

              <p className="text-gray-300 text-sm text-center mt-2 leading-relaxed max-w-[200px]">
                {person.about || "No bio available"}
              </p>

              {/* Skills */}
              {person.skills?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {person.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-teal-400 rounded-full shadow-md hover:scale-105 transition-transform"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
