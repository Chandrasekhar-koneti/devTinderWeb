import Lottie from "lottie-react";
import LoginJson from "../../Lotties/Login.json";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../../../utils/Const";

const Login = () => {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLoginApi = async () => {
    if (!emailId || !password) return setError("Please fill all fields");
    try {
      setLoading(true);
      const response = await axios.post(
        `${Base_Url}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      if (response.data.code === 200) {
        dispatch(addUser(response.data.userDetails));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
      {/* Left - Lottie Animation */}
      <div className="flex justify-center items-center md:w-1/2 w-full p-8">
        <Lottie
          animationData={JSON.parse(JSON.stringify(LoginJson))}
          loop
          autoplay
          className="w-[80%] md:w-[70%] max-h-[80vh]"
        />
      </div>

      {/* Right - Login Card */}
      <div className="flex justify-center items-center md:w-1/2 w-full p-6">
        <div
          className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl p-8 
                     text-white transition-all duration-300 hover:shadow-fuchsia-500/20"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
              Welcome Back 👋
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Let’s sign in and continue exploring
            </p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="your@gmail.com"
              className="input w-full input-md bg-white/20 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={emailId}
              onChange={(e) => {
                setError("");
                setEmailId(e.target.value);
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input w-full input-md bg-white/20 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => {
                setError("");
                setPassword(e.target.value);
              }}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          {/* Login Button */}
          <button
            onClick={handleLoginApi}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white text-sm tracking-wide 
              bg-gradient-to-r from-fuchsia-500 to-blue-500 shadow-lg hover:opacity-90 
              transition-all duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don’t have an account?{" "}
              <button
                className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold underline underline-offset-2 transition-all duration-200"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Optional forgot password */}
          {/* <div className="text-center mt-3">
            <button
              className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
              onClick={() => alert("Forgot password feature coming soon!")}
            >
              Forgot password?
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
