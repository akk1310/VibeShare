import mongoose, { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

// const getVideoComments = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;
//   const { videoId } = req.params;
//   if (!videoId) {
//     throw new ApiError(400, "video id required!");
//   }
//   if (!isValidObjectId(videoId)) {
//     throw new ApiError(400, "video Id is invalid");
//   }
//   // const commentsAggregate = await Comment.aggregate([
//   const pipeline = [
//     {
//       $match: {
//         video: new mongoose.Types.ObjectId(String(videoId)),
//       },
//     },
//     {
//       $lookup: {
//         from: "likes",
//         localField: "_id",
//         foreignField: "comment",
//         as: "likeDetails",
//         pipeline: [
//           {
//             $project: {
//               likedBy: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "owner",
//         foreignField: "_id",
//         as: "ownerDetails",
//         pipeline: [
//           {
//             $project: {
//               username: 1,
//               _id: 1,
//               fullName: 1,
//               avatar: 1,
//             },
//           },
//         ],
//       },
//     },

//     {
//       $addFields: {
//         likesCount: { $size: "$likeDetails" },
//         owner: { $first: "$ownerDetails" },
//         likedUserIds: {
//           $reduce: {
//             input: "$likeDetails",
//             initialValue: [],
//             in: {
//               $concatArrays: ["$$value", "$$this.likedBy"],
//             },
//           },
//         },
//         isLiked: {
//           $cond: {
//             if: { $in: [req.user?._id, "$likedUserIds"] },
//             then: true,
//             else: false,
//           },
//         },
//       },
//     },

//     {
//       $sort: {
//         createdAt: -1,
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         content: 1,
//         likesCount: 1,
//         createdAt: 1,
//         owner: 1,
//         isLiked: 1,
//         likedUserIds: 1, // ← include this so isLiked can evaluate correctly
//       },
//     },
//   ];
//   if (!pipeline) {
//     throw new ApiError(400, "Error fetching comments!");
//   }
//   const options = {
//     page: parseInt(page, 10),
//     limit: parseInt(limit, 10),
//   };

//   const comments = await Comment.aggregatePaginate(
//     Comment.aggregate(pipeline),
//     options
//   );
//   if (!comments) {
//     throw new ApiError(400, "Error fetching comments!");
//   }
//   console.log(comments);
//   return res
//     .status(200)
//     .json(new ApiResponse(200, comments, "Comments fetched successfully!"));
// });
const getVideoComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "video id required!");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video Id is invalid");
  }

  const pipeline = [
    {
      $match: {
        video: new mongoose.Types.ObjectId(String(videoId)),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likeDetails",
        pipeline: [
          {
            $project: {
              likedBy: 1,
            },
          },
        ],
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
              _id: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likeDetails" },
        owner: { $first: "$ownerDetails" },
        likedUserIds: {
          $reduce: {
            input: "$likeDetails",
            initialValue: [],
            in: {
              $concatArrays: ["$$value", ["$$this.likedBy"]],
            },
          },
        },
      },
    },
    {
      $addFields: {
        isLiked: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(req.user?._id), "$likedUserIds"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        likesCount: 1,
        createdAt: 1,
        owner: 1,
        isLiked: 1,
      },
    },
  ];

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    options
  );

  if (!comments) {
    throw new ApiError(400, "Error fetching comments!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully!"));
});


const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "content is required!");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "channel Id is invalid");
  }
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
  });
  if (!comment) {
    throw new ApiError(400, "unable to post comment!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment posted successfully!"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { updatedContent } = req.body;
  if (!commentId) {
    throw new ApiError(400, "comment id required!");
  }
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "comment Id is invalid");
  }
  const comment = await Comment.findById(commentId);
  if (comment?.owner._id.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      400,
      "You can't edit this comment as you are not the owner"
    );
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: updatedContent,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedComment) {
    throw new ApiError(400, "can't update the comment,try again!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated!"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "comment id required!");
  }
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "comment Id is invalid");
  }
  const comment = await Comment.findById(commentId);
  if (comment?.owner._id.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      400,
      "You can't delete this comment as you are not the owner"
    );
  }
  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError(400, "Error in deleting comment!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully!"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
