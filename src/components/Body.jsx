import useVerifyToken from "../CustomHooks/useVerifyToken";
import Navbar from "./common/Navbar";
import { Outlet } from "react-router-dom";

const Body = () => {
  useVerifyToken();

  return (
    <>
      <Navbar />
      <div className="pt-[80px]">
        <Outlet />
      </div>
    </>
  );
};

export default Body;
