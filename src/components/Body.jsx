import useVerifyToken from "../CustomHooks/useVerifyToken";
import Navbar from "./common/Navbar";
import { Outlet } from "react-router-dom";

const Body = () => {
  useVerifyToken();

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Body;
