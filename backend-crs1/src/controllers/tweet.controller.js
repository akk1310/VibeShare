import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import mongoose,{isValidObjectId} from "mongoose";


const createTweet = asyncHandler(async (req,res)=>{
    const {content} = req.body;
    const {channelId} = req.params;
    if(!content || content.trim() === ""){
        throw new ApiError(400,"content is required!");
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"channel Id is invalid")
    }
    const tweet = await Tweet.create({
        content,
        owner:req.user?._id,
        channelId
    })
    if(!tweet){
        throw new ApiError(400,"Problem is publishing tweet,try again!")
    } 
    return res
    .status(200)
    .json(
        new ApiResponse(200,tweet,"Tweet published")
    )
})

const updateTweet = asyncHandler(async (req,res)=>{
    const {tweetId} = req.params;
    const {updatedContent} = req.body;
    if(!tweetId){
        throw new ApiError(404,"Tweet not found!");
    }
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }
    if(!updatedContent){
        throw new ApiError(400,"Tweet Content is required!");
    }
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404,"No Tweet found!");
    }
    if(tweet?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(
            400,
            "You can't edit this tweet as you are not the owner"
        )
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content:updatedContent
            }
        },
        {
            new:true
        }
    )
    if(!updatedTweet){
        throw new ApiError(400,"can't update the tweet,try again!");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedTweet,"Tweet updated!")
    );
})

const deleteTweet = asyncHandler(async (req,res)=>{
    const {tweetId} = req.params;
    
    if(!tweetId){
        throw new ApiError(404,"Tweet not found!");
    }
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }
    
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404,"No Tweet found!");
    }
    if(tweet?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(
            400,
            "You can't edit this tweet as you are not the owner"
        )
    }
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
    if(!deletedTweet){
        throw new ApiError(400,"Error in deleting tweet!");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,tweetId,"Tweet deleted successfully!")
    );
})

const getUserTweets = asyncHandler(async (req,res)=>{
    // const {userId} = req.params;
    const {channelId} = req.params;
    if(!channelId){
        throw new ApiError(400,"error getting tweets!");
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"user id invalid!");
    }
    const tweets =  await Tweet.aggregate([
        {
            $match: {
                channelId: new mongoose.Types.ObjectId(String(channelId)) 
            }
        },
        
        {
            $lookup:{
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as : "likeDetails",
                pipeline:[
                    {
                        $project:{
                            likedBy:1,
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from : "users",
                localField: "owner",
                foreignField:"_id",
                as: "ownerDetails",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1,
                            
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                likesCount:{
                    $size: "$likeDetails",
                },
                owner:{
                    $first: "$ownerDetails",
                },
                isLiked:{
                    $cond:{
                        if: {$in : [req.user?._id,"$likeDetails.likedBy"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $sort:{
                createdAt: -1
            }
        },
        {
            $project:{
                content:1,
                likesCount:1,
                owner:1,
                isLiked:1,
                createdAt:1
            }
        }
    ])

    if(!tweets){
        throw new ApiError(400,"Error fetching tweets!");
    }
    console.log(tweets);
    return res
    .status(200)
    .json(
        new ApiResponse(200,tweets,"Tweets fetched successfully!")
    );
})

export {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets
}