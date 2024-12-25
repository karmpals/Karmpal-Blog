import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreateVideo from "./pages/CreateVideo";
import UpdateVideo from "./pages/UpdateVideo";
import { VideoPage } from "./pages/VideoPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
          <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/video/:videoSlug" element={<VideoPage />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-video" element={<CreateVideo />} />
          <Route path="/update-video/:videoId" element={<UpdateVideo />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
