import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const VideoPage = () => {
  const { videoSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [video, setVideo] = useState(null);
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
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <video
        src={video && video.video}
        alt={video.title}
        controls
        autoPlay
        className="mt-10 p-3 max-h-screen w-full object-cover"
      />
      <h1 className="p-3 text-3xl mt-10 text-left font-serif max-w-2xl max-auto lg:text-4xl">
        {video && video.title}
      </h1>
    </main>
  );
};
