import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export default function VideoCard({ video }) {
  return (
    <div className="relative border border-teal-500 w-full h-[350px] overflow-hidden rounded-lg sm:w-[280px] hover:border-2 transition-all">
      <Link to={`/video/${video.slug}`}>
        <img src={video.image} className="h-[200px] w-full object-cover" />
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold">{video.title}</p>
        <span className="italic text-sm">{video.category}</span>
        <span className="text-xs text-gray-500">
          {moment(video.createdAt).fromNow()}
        </span>
      </div>
      </Link>
    </div>
  );
}
