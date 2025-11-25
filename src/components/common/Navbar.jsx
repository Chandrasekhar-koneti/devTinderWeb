import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { removeUser } from "../../redux/slices/userSlice";
import { getImageSrc } from "../ImageHelper";

const Navbar = () => {
  const loggedInUserData = useSelector((store) => store.user);
  console.log();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      if (response.data?.msg === "User logged out successfully") {
        dispatch(removeUser());
        setOpen(false);
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 z-[999] w-full 
    backdrop-blur-xl bg-white/5 border-b border-white/10 h-[64px]"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between px-5 h-full">
        <Link
          to="/"
          className="text-white text-xl font-semibold tracking-wide drop-shadow-sm"
        >
          DevSwipe
        </Link>

        <div className="flex items-center gap-3">
          {loggedInUserData && (
            <div className="relative">
              <button
                ref={buttonRef}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 group"
              >
                <p className="text-sm text-gray-200 group-hover:text-white transition">
                  Hi, {loggedInUserData?.firstName}
                </p>

                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/30 shadow-md">
                  <img
                    alt="Profile"
                    src={
                      getImageSrc(loggedInUserData?.photo) ||
                      "/images/default-avatar.png"
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {open && (
                <ul
                  ref={menuRef}
                  className="absolute right-0 top-[110%] w-48 rounded-2xl 
                bg-black/60 backdrop-blur-xl 
                text-white border border-white/20 shadow-2xl p-2 
                animate-fade-in z-[2000]"
                >
                  <li className="hover:bg-white/10 rounded-lg">
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm"
                    >
                      Profile
                    </Link>
                  </li>

                  <li className="hover:bg-white/10 rounded-lg">
                    <Link
                      to="/"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm"
                    >
                      Feed
                    </Link>
                  </li>

                  <li className="hover:bg-white/10 rounded-lg">
                    <Link
                      to="/connections"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm"
                    >
                      Connections
                    </Link>
                  </li>

                  <li className="hover:bg-white/10 rounded-lg">
                    <Link
                      to="/requests"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm"
                    >
                      Requests
                    </Link>
                  </li>

                  <li className="hover:bg-white/10 rounded-lg">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-sm"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
