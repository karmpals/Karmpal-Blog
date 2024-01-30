import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const RelatedVideos = ({ video }) => {
  return (
    <div className="flex">
      <Link to={`/video/${video.slug}`}>
        <div className="flex flex-row ">
          <img
            src={video.image}
            className="h-20 m-2 max-w-full mx-auto rounded-xl object-cover "
          />
          <div className="pl-3 flex flex-col mt-1">
            <div className="flex ml-1">
              <span className="text-sm font-semibold dark:text-gray-300">
                {video.title}
              </span>
            </div>
            <div className="flex flex-col ml-1 dark:text-gray-400 ">
              <span className="">{video.category}</span>
              <span className="">{moment(video.createdAt).fromNow()}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RelatedVideos;
