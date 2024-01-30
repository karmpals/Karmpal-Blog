import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState("");
  const [commentError, setCommentError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 300) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          videoId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getvideocomments/${videoId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {}
    };
    getComments();
  }, [videoId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full border flex flex-col border-teal-500 rounded-md p-3"
      >
        <Textarea
          placeholder="Add a comment..."
          rows="1"
          maxLength="300"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <div className="flex justify-between items-center mt-5">
          <p className="text-gray-500 text-xs">
            {300 - comment.length} characters remaining
          </p>
          <Button outline gradientDuoTone="purpleToBlue" type="submit">
            Submit
          </Button>
        </div>
        {commentError && (
          <Alert className="mt-5" color="failure">
            {commentError}
          </Alert>
        )}
      </form>
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="my-5 text-sm flex items-center gap-1">
            <p>Comments</p>
            <div className="py-1 px-2 border border-gray-400 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comments
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
