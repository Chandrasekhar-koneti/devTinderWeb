import { useEffect, useState } from "react";
import axios from "axios";
import { motion, useMotionValue } from "framer-motion";
import { IoMdCloseCircle } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import useProfile from "../../CustomHooks/useProfile";
import Lottie from "lottie-react";
import Nodata from "../../Lotties/Nodata.json";

const SWIPE_THRESHOLD = 120; // how far to drag before swipe happens

export default function Feed() {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [swipeFeedback, setSwipeFeedback] = useState(null);

  const navigate = useNavigate();
  const { profile } = useProfile();

  useEffect(() => {
    profile();
  }, []);

  // Fetch feed
  const feedApi = async (pageNum = 1) => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/feed?page=${pageNum}&limit=10`,
        { withCredentials: true }
      );

      const newUsers = response.data.usersToShow || [];

      if (!newUsers.length) {
        setHasMore(false);
      } else {
        setPeople((prev) => [
          ...prev,
          ...newUsers.filter((u) => !prev.some((p) => p._id === u._id)),
        ]);
      }

      setLoading(false);
    } catch (err) {
      console.log("Feed error:", err);
      setLoading(false);

      if (err?.response?.data?.err === "Token is not valid") {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    feedApi(page);
  }, [page]);

  // Send interested/ignored
  const reviewUser = async (status, userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      return true;
    } catch (err) {
      console.log("Review error:", err);
      return false;
    }
  };

  // Remove card + load next page if needed
  const removeCard = (id) => {
    setPeople((prev) => {
      const updated = prev.filter((p) => p._id !== id);
      if (updated.length === 0 && hasMore && !loading) {
        setPage((pg) => pg + 1);
      }
      return updated;
    });
  };

  // DRAG handling per card
  const Card = ({ person, index }) => {
    const x = useMotionValue(0);

    const handleDragEnd = async (_, info) => {
      const dragX = info.offset.x;

      if (Math.abs(dragX) < SWIPE_THRESHOLD) return; // not enough movement

      const direction = dragX > 0 ? "right" : "left";

      setSwipeFeedback(direction);

      const status = direction === "right" ? "interested" : "ignored";

      const ok = await reviewUser(status, person._id);

      if (ok) {
        removeCard(person._id);
      } else {
        alert("Could not update. Try again.");
      }

      setTimeout(() => setSwipeFeedback(null), 300);
    };

    // Programmatic button swipe
    const swipeProgrammatically = async (direction) => {
      setSwipeFeedback(direction);

      const status = direction === "right" ? "interested" : "ignored";
      const ok = await reviewUser(status, person._id);

      if (ok) removeCard(person._id);
      else alert("Could not update. Try again.");

      setTimeout(() => setSwipeFeedback(null), 300);
    };

    person.swipe = swipeProgrammatically;

    return (
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        <div
          className="w-full h-full rounded-3xl bg-cover bg-center shadow-xl border border-white/10 overflow-hidden"
          style={{ backgroundImage: `url(${person.photoUrl})`, zIndex: index }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

          <div className="absolute bottom-0 w-full p-5">
            <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10">
              <h2 className="text-white text-2xl font-bold">
                {person.firstName} {person.lastName},{" "}
                <span className="text-gray-300">{person.age}</span>
              </h2>
              <p className="text-gray-200 text-sm mt-1 line-clamp-2">
                {person.about}
              </p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10 text-gray-200">
                  {person.gender}
                </span>
              </div>
            </div>
          </div>

          {/* Swipe Feedback */}
          {swipeFeedback === "right" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-green-500 text-6xl font-bold animate-pulse">
                ❤️ Liked
              </div>
            </div>
          )}

          {swipeFeedback === "left" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500 text-6xl font-bold animate-pulse">
                ✖ Ignored
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#141e30] to-[#243b55] overflow-hidden">
      {/* Header */}
      {people.length > 0 && (
        <div className="sticky top-0 bg-transparent z-20 max-w-md mx-auto px-4 pt-4">
          <div className="rounded-2xl bg-white/10 px-5 py-3 shadow-md backdrop-blur-md border border-white/10">
            <h1 className="text-white text-xl font-bold">Discover</h1>
            <p className="text-gray-300 text-xs">Swipe to connect</p>
          </div>
        </div>
      )}

      {/* No more cards */}
      {people.length === 0 && !hasMore && (
        <div className="mt-16 flex flex-col items-center">
          <Lottie animationData={Nodata} className="w-52 h-52" />
          <p className="text-white text-lg font-semibold mt-3">
            You’re all caught up!
          </p>
          <p className="text-gray-300 text-sm">
            Check back later for new profiles.
          </p>
        </div>
      )}

      {/* Cards */}
      <div
        className={`relative max-w-md mx-auto  mt-6 ${
          people?.length > 0 ? "h-[520px]" : "h-[20px]"
        } `}
      >
        {people
          .slice(0)
          .reverse()
          .map((p, index) => (
            <Card key={p._id} person={p} index={index + 1} />
          ))}
      </div>

      {/* Bottom Buttons */}
      {people.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-8">
          <button
            onClick={() => people[people.length - 1]?.swipe("left")}
            className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"
          >
            <IoMdCloseCircle size={25} className="text-red-500" />
          </button>

          <button
            onClick={() => people[people.length - 1]?.swipe("right")}
            className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"
          >
            <FaHeart size={20} className="text-green-500" />
          </button>
        </div>
      )}

      {/* Loading More */}
      {loading && (
        <div className="mt-8 flex flex-col items-center text-gray-300">
          <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm mt-2">Loading more profiles...</p>
        </div>
      )}
    </div>
  );
}
