import mongoose, { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if ([name, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user?._id,
  });
  if (!playlist) {
    throw new ApiError(400, "unable to create playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, "playlist id required");
  }
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id invalid");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "no playlist found with this id");
  }
  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "not authorized to update this playlist");
  }
  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!deletedPlaylist) {
    throw new ApiError(400, "playlist not deleted,try again!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!playlistId) {
    throw new ApiError(400, "playlist id required");
  }
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id invalid");
  }
  if ([name, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "no playlist found with this id");
  }
  if (playlist?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "not authorized to update this playlist");
  }
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedPlaylist) {
    throw new ApiError(400, "playlist not updated,try again");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "playlist updated successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid PlaylistId or videoId");
  }

  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!video) {
    throw new ApiError(404, "video not found");
  }
  if (
    (playlist.owner?.toString() && video.owner.toString()) !==
    req.user?._id.toString()
  ) {
    throw new ApiError(400, "only owner can add video to their playlist");
  }
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedPlaylist) {
    throw new ApiError(400, "failed to add video to playlist please try again");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Added video to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid PlaylistId or videoId");
  }

  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!video) {
    throw new ApiError(404, "video not found");
  }
  if (
    (playlist.owner?.toString() && video.owner.toString()) !==
    req.user?._id.toString()
  ) {
    throw new ApiError(
      400,
      "only owner can remove a video from their playlist"
    );
  }
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedPlaylist) {
    throw new ApiError(
      400,
      "failed to remove a video from playlist please try again"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Removed video from playlist successfully"
      )
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "userId required!");
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "invalid userId");
  }
  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(String(userId)),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
    {
      $addFields: {
        totalVideos: {
          $size: "$videos",
        },
        totalViews: {
          $sum: "$videos.views",
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        totalVideos: 1,
        totalViews: 1,
        updatedAt: 1,
        ownerDetails: 1,
      },
    },
  ]);
  if (!playlists) {
    throw new ApiError(400, "failed to fetch playlists");
  }
  console.log(playlists);
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User playlists fetched successfully")
    );
});

// const getPlaylistById = asyncHandler(async (req, res) => {
//   const { playlistId } = req.params;
//   if (!playlistId) {
//     throw new ApiError(400, "playlist id required");
//   }
//   if (!isValidObjectId(playlistId)) {
//     throw new ApiError(400, "playlist id invalid");
//   }
//   const playlistToFind = await Playlist.findById(playlistId);

//   if (!playlistToFind) {
//     throw new ApiError(404, "Playlist not found");
//   }

//   const playlist = await Playlist.aggregate([
//     {
//       $match: {
//         _id: new mongoose.Types.ObjectId(String(playlistId)),
//       },
//     },
//     {
//       $lookup: {
//         from: "videos",
//         localField: "videos",
//         foreignField: "_id",
//         as: "videos",
//       },
//     },
//     {
//       $match: {
//         "videos.isPublished": true,
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "owner",
//         foreignField: "_id",
//         as: "ownerDetails",
//       },
//     },
//     {
//       $addFields: {
//         totalVideos: {
//           $size: "$videos",
//         },
//         totalViews: {
//           $sum: "videos.views",
//         },
//         owner: {
//           $first: "$ownerDetails",
//         },
//       },
//     },
//     {
//       $project: {
//         name: 1,
//         description: 1,
//         createdAt: 1,
//         updatedAt: 1,
//         totalVideos: 1,
//         totalViews: 1,
//         videos: {
//           _id: 1,
//           title: 1,
//           description: 1,
//           duration: 1,
//           createdAt: 1,
//           views: 1,
//           "videoFile.url": 1,
//           "thumbnail.url": 1,
//         },
//         ownerDetails: {
//           username: 1,
//           fullName: 1,
//           avatar: 1,
//         },
//       },
//     },
//   ]);
//   if (!playlist) {
//     throw new ApiError(400, "unable to fetch user playlists!");
//   }
//   console.log(playlist);
//   return res
//     .status(200)
//     .json(new ApiResponse(200, playlist, "playlist fetched successfully"));
// });

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) throw new ApiError(400, "playlist id required");
  if (!isValidObjectId(playlistId)) throw new ApiError(400, "playlist id invalid");

  const playlistToFind = await Playlist.findById(playlistId);
  if (!playlistToFind) throw new ApiError(404, "Playlist not found");

  const playlist = await Playlist.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(String(playlistId)) },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
    // ✅ filter published videos only
    {
      $addFields: {
        videos: {
          $filter: {
            input: "$videos",
            as: "video",
            cond: { $eq: ["$$video.isPublished", true] }
          }
        }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $addFields: {
        totalVideos: { $size: "$videos" },
        totalViews: {
          $sum: {
            $map: {
              input: "$videos",
              as: "video",
              in: "$$video.views"
            }
          }
        },
        owner: { $first: "$ownerDetails" }
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        totalVideos: 1,
        totalViews: 1,
        videos: {
          _id: 1,
          title: 1,
          description: 1,
          duration: 1,
          createdAt: 1,
          views: 1,
          "videoFile.url": 1,
          "thumbnail.url": 1,
        },
        ownerDetails: {
          username: 1,
          fullName: 1,
          avatar: 1,
        },
      },
    },
  ]);

  if (!playlist || playlist.length === 0) {
    throw new ApiError(404, "Playlist not found or has no published videos");
  }

  return res.status(200).json(
    new ApiResponse(200, playlist[0], "playlist fetched successfully")
  );
});


const getPlaylistsByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "username required!");
  }

  // Find the user by username
  const user = await User.findOne({ username }).select("_id");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
    {
      $addFields: {
        totalVideos: { $size: "$videos" },
        totalViews: { $sum: "$videos.views" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        totalVideos: 1,
        totalViews: 1,
        updatedAt: 1,
        ownerDetails: 1,
        videos: {
          $map: {
            input: "$videos",
            as: "video",
            in: {
              thumbnail: "$$video.thumbnail",
            },
          },
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlists,
        "Playlists by username fetched successfully"
      )
    );
});

export {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists,
  getPlaylistById,
  getPlaylistsByUsername,
};
