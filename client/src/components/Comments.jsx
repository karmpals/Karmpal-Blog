import React, { useEffect, useState } from "react";
import moment from "moment";

export default function Comments({ comment }) {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {}
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center">
          <span className="mr-1 font-bold text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="mb-2 text-gray-500">{comment.content}</p>
      </div>
    </div>
  );
}
