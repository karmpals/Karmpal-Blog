import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(null);
  const [videoUploadError, setVideoUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const handleUploadVideo = async () => {
    try {
      if (!videoFile) {
        setVideoUploadError("Please select an video");
        return;
      }
      setVideoUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + videoFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, videoFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setVideoUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setVideoUploadError("Something went wrong!");
          setVideoUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setVideoUploadError(null);
            setVideoUploadProgress(null);
            setFormData({ ...formData, video: downloadURL });
          });
        }
      );
    } catch (error) {
      setVideoUploadError("Something went wrong!");
      setVideoUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/video/updatevideo/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/video/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  useEffect(() => {
    try {
      const fetchVideo = async () => {
        const res = await fetch(`/api/video/getvideos?videoId=${videoId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.videos[0]);
        }
      };
      fetchVideo();
    } catch (error) {}
  }, [videoId]);

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update video</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            className="flex-1"
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="movie">Movie</option>
            <option value="web-series">Web-Series</option>
            <option value="music">Music</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadVideo}
            disabled={videoUploadProgress}
          >
            {videoUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={videoUploadProgress}
                  text={`${videoUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Video"
            )}
          </Button>
        </div>
        {videoUploadError && <Alert color="failure">{videoUploadError}</Alert>}
        {formData.video && (
          <video
            src={formData.video}
            alt="upload"
            className="w-full h-72 object-fit"
            controls
          />
        )}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
