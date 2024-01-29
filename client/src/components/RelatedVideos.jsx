import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const RelatedVideos = () => {
  const { videoSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [video, setVideo] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/video/getvideos`);
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
  return (
    <div>
      {/* {videos.map((video) => ( */}
      <Link to={`/video/${video}`}>
        <div className="flex flex-row box-shadow w-full border border-teal-300  rounded-tl-3xl rounded-tr-3xl p-3">
          <img src={video && video.image} className="h-[100px] rounded" />
          <div className="flex flex-col">
            <span className="p-3 pt-0 font-semibold flex-wrap pb-0">
              {video && video.title}
            </span>
            <span className="ml-3">
              uploaded on:
              {new Date( video&& video.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
      {/* ))} */}
    </div>
  );
};

export default RelatedVideos;
