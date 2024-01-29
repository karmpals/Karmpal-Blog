import { Alert, Button, FileInput, Select, TextInput, Textarea } from "flowbite-react";
import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

export default function CreateVideo() {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [file, setFile] = useState(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(null);
  const [imageUploadProgress, setimageUploadProgress] = useState(null);
  const [videoUploadError, setVideoUploadError] = useState(null);
  const [imageUploadError, setimageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

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
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setimageUploadError("Please select an image");
        return;
      }
      setimageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setVideoUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setimageUploadError("Something went wrong!");
          setimageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageUploadError(null);
            setimageUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setimageUploadError("Something went wrong!");
      setimageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/video/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
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

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Upload a video
      </h1>
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
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
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
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {videoUploadError && <Alert color="failure">{videoUploadError}</Alert>}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.video && (
          <video
            src={formData.video}
            alt="upload"
            className="w-full h-72 object-fit"
            controls
          />
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-fit"
            controls
          />
        )}
        <Textarea
          className="h-72 mb-12"
          placeholder="Write something..."
          required
          onChange={(e) => {
            setFormData({ ...formData, content: e.target.value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
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
