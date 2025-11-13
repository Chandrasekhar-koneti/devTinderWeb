import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../../utils/Const";

const useVerifyToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${Base_Url}/verify-token`, {
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
