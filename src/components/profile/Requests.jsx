"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Base_Url } from "../../../utils/Const";
import { setRequests } from "../../redux/slices/connectionSlice";
import { RiCloseLargeFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import useProfile from "../../CustomHooks/useProfile";
import Nodatafound from "../../Lotties/Nodatafound.json";
import Lottie from "lottie-react";

const Requests = () => {
  const dispatch = useDispatch();
  const requestsData = useSelector((store) => store?.connections?.requests);
  const { profile } = useProfile();

  // Fetch incoming requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${Base_Url}/user/request/recieved`, {
        withCredentials: true,
      });
      profile();
      const list = response?.data?.getRequestList || [];
      dispatch(setRequests(list));
    } catch (err) {
      console.log("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle accept/reject
  const handleAcceptIgnore = async (status, id) => {
    try {
      await axios.post(
        `${Base_Url}/request/review/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      fetchRequests();
    } catch (err) {
      console.log("Error accepting request:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-10 px-6">
      {/* Header */}
      {requestsData?.length > 0 && (
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400 drop-shadow-lg">
            Incoming Requests 💌
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            People who want to connect with you
          </p>
        </div>
      )}

      {/* Request Cards */}
      {requestsData?.length > 0 ? (
        <div
          className={`grid gap-10 sm:grid-cols-2 lg:grid-cols-3 ${
            requestsData?.length <= 2
              ? "justify-center lg:place-items-center"
              : ""
          }`}
        >
          {requestsData.map((req) => {
            const user = req.fromUserId;
            return (
              <div
                key={req._id}
                className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg 
                           hover:shadow-2xl transition-all duration-300 text-center"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-fuchsia-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Profile image */}
                <div className="relative flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={
                        user?.photoUrl ||
                        "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt={user?.firstName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-transparent group-hover:border-fuchsia-500 transition-all duration-500"
                    />
                    <span className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-gray-900 shadow-md"></span>
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-white capitalize">
                    {user?.firstName} {user?.lastName}
                  </h2>

                  <p className="text-sm text-gray-400">
                    {user?.gender} • {user?.age} yrs
                  </p>

                  {user?.about && (
                    <p className="text-gray-300 text-sm mt-2 px-4 line-clamp-2">
                      {user.about}
                    </p>
                  )}

                  {/* Skills */}
                  {user?.skills?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      {user.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-fuchsia-500 shadow-md hover:scale-105 transition-transform"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-6 mt-6 relative z-10">
                  <button
                    onClick={() => handleAcceptIgnore("accepted", req._id)}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 
                               text-white shadow-lg hover:scale-110 hover:shadow-green-500/40 transition-all duration-300"
                    title="Accept"
                  >
                    <FaCheck size={20} />
                  </button>

                  <button
                    onClick={() => handleAcceptIgnore("rejected", req._id)}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 
                               text-white shadow-lg hover:scale-110 hover:shadow-pink-500/40 transition-all duration-300"
                    title="Reject"
                  >
                    <RiCloseLargeFill size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center mt-20 md:mt-10 text-center">
          <Lottie
            animationData={JSON.parse(JSON.stringify(Nodatafound))}
            loop
            autoplay
            className="w-[240px] h-[240px]"
          />
          <p className="text-white text-lg font-semibold mt-3">
            No connection requests right now
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Check back later — someone might be interested soon ✨
          </p>
        </div>
      )}
    </div>
  );
};

export default Requests;
