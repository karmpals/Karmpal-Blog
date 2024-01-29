import { Alert, Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const CommentSection = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 300) {
      return;
    }
    try {
      // setCommentError(null);
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
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full border flex flex-col border-teal-500 rounded-md p-3"
    >
      <Textarea
        placeholder="Add a comment..."
        rows="3"
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
  );
};

export default CommentSection;
