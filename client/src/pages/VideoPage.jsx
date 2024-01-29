import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RelatedVideos from "../components/RelatedVideos";
import CommentSection from "../components/CommentSection";

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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="p-3 flex lg:flex-2 flex-col max-w-full mx-auto min-h-[200px]">
        <video
          src={video && video.video}
          alt={video.title}
          controls
          // autoPlay
          className="p-3 max-h-[550px] w-[950px] object-cover"
        />
        <h1 className="p-3 text-3xl text-left font-serif max-w-[990px] max-auto lg:text-2xl">
          {video && video.title}
        </h1>
      </div>
      <div className="flex flex-1 flex-col p-6">
      <CommentSection videoId={video._id}/>
     </div>
    </div>
  );
};
