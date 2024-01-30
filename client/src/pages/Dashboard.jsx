import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";
import { DashUsers } from "../components/DashUsers";
import DashVideos from "../components/DashVideos";
import DashComments from "../components/DashComments";
import DashComponent from "../components/DashComponent";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen mt-[46px] pt-4 flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "videos" && <DashVideos />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
      {tab === "dash" && <DashComponent />}
    </div>
  );
}
