import VideoCard from "../components/VideoCard";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Home() {
  const { videoSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [video, setVideo] = useState(null);
  const [recentVideos, setRecentVideos] = useState(null);


  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/video/getvideos?slug=${videoSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setVideo(data.videos[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoSlug]);
  useEffect(() => {
    try {
      const fetchRecentVideos = async () => {
        const res = await fetch(`/api/video/getvideos`);
        const data = await res.json();
        if (res.ok) {
          setRecentVideos(data.videos);
        }
      };
      fetchRecentVideos();
    } catch (error) {}
  }, []);
  return (
    <div className="flex flex-wrap gap-5 pt-5 mt-[61.7px] justify-center min-h-screen ">
      {recentVideos &&
        recentVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
          ))}
          
    </div>
  );
}
