import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comments({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [isEdting, setIsEdting] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
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

  const handleEdit = async () => {
    setIsEdting(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEdting(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {}
  };
 

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
        {isEdting ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                outline
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm"
                onClick={() => setIsEdting(false)}
              >
                Cancle
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 text-gray-500">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-500 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                } `}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500"
                    onClick={()=>onDelete(comment._id)}
                  >
                    Delete
                  </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
