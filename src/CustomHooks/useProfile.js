import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const useProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const profile = async () => {
    if (user) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/profile/view`,
        {
          withCredentials: true,
        }
      );
      if (response) {
        const cleanUser = JSON.parse(JSON.stringify(response.data.profile));
        dispatch(addUser(cleanUser));
      }
    } catch (err) {
      if (err?.response?.data?.err === "Token is not valid") {
        navigate("/login");
      }
    }
  };

  return { profile };
};

export default useProfile;
