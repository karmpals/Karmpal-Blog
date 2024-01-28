import Video from "../modals/video.modal.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a video"));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newVideo = new Video({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

export const getvideos = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const videos = await Video.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.videoId && { _id: req.query.videoId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, Option: "i" } },
          { contnet: { $regex: req.query.searchTerm, Option: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalVideos = await Video.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthVideos = await Video.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.json({
      videos,
      totalVideos,
      lastMonthVideos,
    });
  } catch (error) {
    next(error);
  }
};

export const deletevideo = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this video"));
  }
  try {
    await Video.findByIdAndDelete(req.params.videoId);
    res.status(200).json("This video has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatevideo = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this video"));
  }
  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.videoId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          video: req.body.video,
          category: req.body.category,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedVideo);
  } catch (error) {
    next(error);
  }
};
