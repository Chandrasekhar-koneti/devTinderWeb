import React, { useEffect } from "react";
import ProfileCard from "../ui/ProfileCard";

import useProfile from "../../CustomHooks/useProfile";

const Profile = () => {
  const { profile } = useProfile();

  useEffect(() => {
    console.log("kerl");
    profile();
  }, []);

  return (
    <div className="flex  justify-center sm:px-0 py-8 px-2">
      <ProfileCard />
    </div>
  );
};

export default Profile;
