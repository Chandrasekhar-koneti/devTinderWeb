import useVerifyToken from "../CustomHooks/useVerifyToken";
import Navbar from "./common/Navbar";
import { Outlet } from "react-router-dom";

const Body = () => {
  useVerifyToken();

  return (
    <>
      <Navbar /> {/* stays above everything, no white bg interference */}
      <div className="pt-[80px]">
        {" "}
        {/* content starts below navbar */}
        <Outlet />
      </div>
    </>
  );
};

export default Body;
