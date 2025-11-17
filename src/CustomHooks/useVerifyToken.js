import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const useVerifyToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/verify-token`, {
        withCredentials: true,
      })
      .then((res) => {
        return res;
        // dispatch(addUser(res.data.user));
      })
      .catch(() => {
        dispatch(removeUser());
        navigate("/login");
      });
  }, []);
};

export default useVerifyToken;
