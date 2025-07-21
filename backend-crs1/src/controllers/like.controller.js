import mongoose, {isValidObjectId} from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    if(!videoId){
        throw new ApiError(400,"videoId required");
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"videoId invalid");
    }
    const likedAlready = await Like.findOne(
        {
            video:videoId,
            likedBy:req.user?._id
        }
    )
    if(likedAlready){
        await Like.findByIdAndDelete(likedAlready._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false },"toggle disliked successfully"));
    }
    await Like.create({
        video:videoId,
        likedBy:req.user?._id
    })
    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }));
    
})
// const toggleCommentLike = asyncHandler(async (req, res) => {
//     const {commentId} = req.params;
//     if(!commentId){
//         throw new ApiError(400,"commentId required");
//     }
//     if(!isValidObjectId(commentId)){
//         throw new ApiError(400,"commentId invalid");
//     }
//     const likedAlready = await Like.findOne(
//         {
//             comment:commentId,
//             likedBy:req.user?._id
//         }
//     )
//     if(likedAlready){
//         await Like.findByIdAndDelete(likedAlready._id)
//         return res
//             .status(200)
//             .json(new ApiResponse(200, { isLiked: false },"toggle disliked successfully"));
//     }
//     await Like.create({
//         comment:commentId,
//         likedBy:req.user?._id
//     })
//     return res
//         .status(200)
//         .json(new ApiResponse(200, { isLiked: true },"liked successfully"));

// })
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "commentId required");
    }
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "commentId invalid");
    }

    const likedAlready = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    });

    let isLiked;

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready._id);
        isLiked = false;
    } else {
        await Like.create({
            comment: commentId,
            likedBy: req.user?._id,
        });
        isLiked = true;
    }

    // ✅ Fetch the updated count
    const updatedLikesCount = await Like.countDocuments({ comment: commentId });

    return res.status(200).json(
        new ApiResponse(200, {
            _id: commentId,
            isLiked,
            likesCount: updatedLikesCount
        }, `Toggle ${isLiked ? "liked" : "disliked"} successfully`)
    );
});


const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400,"tweetId required");
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"tweetId invalid");
    }
    const likedAlready = await Like.findOne(
        {
            tweet:tweetId,
            likedBy:req.user?._id
        }
    )
    if(likedAlready){
        await Like.findByIdAndDelete(likedAlready._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false },"toggle disliked successfully"));
    }
    await Like.create({
        tweet:tweetId,
        likedBy:req.user?._id
    })
    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true },"liked successfully"));
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideosAggregate = await Like.aggregate([
        {
            $match:{
                likedBy : new mongoose.Types.ObjectId(String(req.user?._id))
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"likedVideos",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"ownerDetails",
                        }
                    },
                    {
                        $unwind:"$ownerDetails"
                    }
                ]
            }
        },
        {
            $unwind: "$likedVideos"
        },
        {
            $sort:{
                cratedAt:-1,
            }
        },
        {
            $project:{
                _id:0,
                totalLikedVideos:1,
                likedVideos:{
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: {
                        username: 1,
                        fullName: 1,
                        avatar: 1,
                    },
                }
            }
        }
    ]);
    console.log(likedVideosAggregate);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideosAggregate,
                "liked videos fetched successfully"
            )
        );
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}