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
        const res = await fetch(`/api/video/getvideos?limit=10`);
        const data = await res.json();
        if (res.ok) {
          setRecentVideos(data.videos);
        }
      };
      fetchRecentVideos();
    } catch (error) {}
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col md:flex-row mt-10 pt-5">
      <div className="p-3 flex flex-col max-w-full mx-auto min-h-[200px]">
        <video
          src={video && video.video}
          alt={video.title}
          controls
          autoPlay
          className="p-3 max-h-[550px] w-[950px] object-cover"
        />
        <h1 className="p-3 text-3xl text-left font-serif max-w-[990px] max-auto lg:text-2xl">
          {video && video.title}
        </h1>
        <div className="p-3 w-full">
          <CommentSection videoId={video._id} />
        </div>
      </div>
      <div className="flex flex-col p-3">
        <div className="flex flex-col justify-center items-center mb-3">
          <h1 className="text-xl mt-5">Recent video</h1>
          <div className="border-t border-teal-500 mt-2">
            {recentVideos &&
              recentVideos.map((video) => (
                <RelatedVideos key={video._id} video={video} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
