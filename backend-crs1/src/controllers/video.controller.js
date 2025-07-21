import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import {
  deleteOnCloudinary,
  deleteOnCloudinaryById,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import mongoose,{isValidObjectId} from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";

// const getAllVideos = asyncHandler(async (req, res)=>{
//     //TODO: get all videos based on query, sort, pagination
//     // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
//     const { sortBy = "createdAt", sortType = "desc" } = req.query;
//     const videos = await Video.find({ isPublished: true})
//         .populate("owner", "username avatar") // fetch only username and avatar of the uploader
//         .sort({[sortBy]: sortType === "asc" ? 1 : -1  }); // optional: newest first
//     if(!videos){
//         throw new ApiError(400,"Error fetching videos!");
//     }
//     return res.status(200).json(
//         new ApiResponse(200, videos, "All videos fetched successfully")
//     );
// })
const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = { isPublished: true };

  // Add search by title or description using regex
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  // Add user filter
  // if (userId) {
  //     if (!isValidObjectId(userId)) {
  //         throw new ApiError(400, "Invalid userId");
  //     }
  //     filter.owner = userId;
  // }
  if (userId && isValidObjectId(userId)) {
    filter.owner = userId;
  } else if (userId) {
    throw new ApiError(400, "Invalid userId");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOption = {
    [sortBy]: sortType === "asc" ? 1 : -1,
  };

  const videos = await Video.find(filter)
    .populate("owner", "username avatar")
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const totalVideos = await Video.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        docs: videos,
        totalDocs: totalVideos,
        limit: parseInt(limit),
        page: parseInt(page),
        totalPages: Math.ceil(totalVideos / parseInt(limit)),
        hasNextPage: skip + videos.length < totalVideos,
        hasPrevPage: parseInt(page) > 1,
      },
      "All videos fetched successfully"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  try {
    const { title, description } = req.body;
    // console.log(title);
    if ([title, description].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
    const videoLocalPath = req.files?.video[0].path;
    // console.log(videoLocalPath);
    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if (!videoLocalPath) {
      throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail file is required");
    }
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
      throw new ApiError(500, "Video file upload failed");
    }
    if (!thumbnail) {
      throw new ApiError(500, "Thumbnail file upload failed");
    }
    const video = await Video.create({
      videoFile: {
        url: videoFile.url,
        public_id: videoFile.public_id,
      },
      thumbnail: {
        url: thumbnail.url,
        public_id: thumbnail.public_id,
      },
      title,
      description,
      duration: videoFile.duration,
      owner: req.user?._id,
      cloudinaryPublicId: videoFile.public_id,
    });
    const uploadedVideo = await Video.findById(video._id).populate("owner");
    if (!uploadedVideo) {
      throw new ApiError(500, "Video upload failed!!");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(200, uploadedVideo, "Video uploaded successfully!")
      );
  } catch (error) {
    throw new ApiError(400, error.message || "Video upload error");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // console.log(videoId);
  if (!videoId || videoId.trim() === "") {
    throw new ApiError(400, "Video ID is required");
  }
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  if (!mongoose.isValidObjectId(req.user?._id)) {
    throw new ApiError(400, "Invalid userId");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(String(videoId)),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscribersCount: {
                $size: "$subscribers",
              },
              isSubscribed: {
                $cond: {
                  if: {
                    $in: [req.user?._id, "$subscribers.subscriber"],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              username: 1,
              avatar: 1,
              subscribersCount: 1,
              isSubscribed: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
        owner: {
          $first: "$owner",
        },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        "videoFile.url": 1,
        title: 1,
        description: 1,
        views: 1,
        createdAt: 1,
        duration: 1,
        comments: 1,
        owner: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
  ]);
  //  const video = await Video.findById(videoId).populate('owner', 'username');

  if (!video) {
    throw new ApiError(500, "failed to fetch video");
  }

  //Increase views as the user fetched the video
  const result = await Video.findByIdAndUpdate(
    videoId,
    {
      $inc: {
        views: 1,
      },
    },
    {
      new: true,
    }
  );
  // console.log(result);

  // add this video to user watch history
  await User.findByIdAndUpdate(req.user?._id, {
    $addToSet: {
      watchHistory: videoId,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "video details fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;
    if (!title && !description) {
      throw new ApiError(400, "All fields are required!");
    }
    if (!mongoose.isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
    }
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "No video found");
    }
    if (video?.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(
        400,
        "You can't edit this video as you are not the owner"
      );
    }
    const thumbnailToDelete = video.thumbnail.public_id;
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "thumbnail is required");
    }
    // console.log(thumbnailLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
      throw new ApiError(400, "thumbnail not found");
    }
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title,
          description,
          thumbnail: {
            public_id: thumbnail.public_id,
            url: thumbnail.url,
          },
        },
      },
      { new: true }
    );
    if (!updatedVideo) {
      throw new ApiError(500, "Failed to update video please try again");
    }
    if (updatedVideo) {
      await deleteOnCloudinary(thumbnailToDelete);
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
  } catch (error) {
    throw new ApiError(400, error.message || "error updating!");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "video file is required!");
  }
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "No video found");
  }
  if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      400,
      "You can't edit this video as you are not the owner"
    );
  }
  const videoDeleted = await Video.findByIdAndDelete(videoId);
  if (!videoDeleted) {
    throw new ApiError(400, "Failed to delete the video please try again");
  }
  await deleteOnCloudinaryById(video.thumbnail.public_id);
  await deleteOnCloudinaryById(video.videoFile.public_id, "video");

  // delete video likes
  // await Like.deleteMany({
  //     video: videoId
  // })

  // delete video comments
  // await Comment.deleteMany({
  //     video: videoId,
  // })
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "video file required!");
  }
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "No video found");
  }
  if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      400,
      "You can't toggle publish status as you are not the owner"
    );
  }
  const toggledVideoPublish = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video?.isPublished,
      },
    },
    {
      new: true,
    }
  );
  if (!togglePublishStatus) {
    throw new ApiError(500, "Failed to toggle video publish status");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: toggledVideoPublish.isPublished },
        "Video toggled successfully!"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
