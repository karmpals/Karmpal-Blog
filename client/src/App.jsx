import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreateVideo from "./pages/CreateVideo";
import UpdateVideo from "./pages/UpdateVideo";
import { VideoPage } from "./pages/VideoPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-video" element={<CreateVideo />} />
          <Route path="/update-video/:videoId" element={<UpdateVideo />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path="/video/:videoSlug" element={<VideoPage />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}
