import mongoose,{isValidObjectId} from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription= asyncHandler(async (req,res)=>{
    const {channelId} = req.params;
    if(!channelId){
        throw new ApiError(400,"channel id required!");
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"invalid channel Id");
    }
    const isSubscribed = await Subscription.findOne({
        subscriber:req.user?._id,
        channel:channelId,
    });
    if(isSubscribed){
        await Subscription.findByIdAndDelete(isSubscribed?._id);
        return res
        .status(200)
        .json(
            new ApiResponse(200,{subscribed:false},"unsubscribed successfully!")
        )
    }
    await Subscription.create({
        subscriber:req.user?._id,
        channel:channelId,
    });
    return res
        .status(200)
        .json(
            new ApiResponse(200,{subscribed:true},"subscribed successfully!")
        )
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req,res)=>{
    const {channelId} = req.params;
    const currentUserId = req.user?._id;
    if(!channelId){
        throw new ApiError(400,"channel required");
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"invalid channel Id");
    }
    // const subscribers= await Subscription.aggregate([
    //     {
    //         $match: {
    //             channel: new mongoose.Types.ObjectId(String(channelId)),
    //         },
    //     },
    //     {
    //         $lookup:{
    //             from:"users",
    //             localField: "subscriber",
    //             foreignField:"_id",
    //             as:"subscriber",
    //             pipeline:[
    //                 {
    //                     $lookup:{
    //                         from : "subscriptions",
    //                         localField: "_id",
    //                         foreignField: "channel",
    //                         as:"subscribedToSubscriber",
    //                     }
    //                 },
    //                 {
    //                     $addFields:{
    //                         subscribedToSubscribers:{
    //                             $cond:{
    //                                 if: {
    //                                     $in: [
    //                                         channelId,
    //                                         "$subscribedToSubscriber.subscriber"
    //                                     ],
    //                                 },
    //                                 then:true,
    //                                 else:false,
    //                             },
    //                         },
    //                         subscribersCount:{
    //                             $size:"$subscribedToSubscriber",
    //                         }
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $unwind: "$subscriber",
    //     },
    //     {
    //         $project: {
    //             _id: 0,
    //             subscriber: {
    //                 _id: 1,
    //                 username: 1,
    //                 fullName: 1,
    //                 "avatar.url": 1,
    //                 subscribedToSubscriber: 1,
    //                 subscribersCount: 1,
    //             },
    //         },
    //     },
        
    // ]);
    const subscribers= await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(String(channelId)),
            },
        },
        {
            $lookup:{
                from:"users",
                localField: "subscriber",
                foreignField:"_id",
                as:"subscriberDetails"
            }
        },
         {
        $unwind: "$subscriberDetails"
        },
        {
            $lookup: {
                from: "subscriptions",
                let: { subscriberId: "$subscriberDetails._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$subscriber", new mongoose.Types.ObjectId(currentUserId)] },
                                    { $eq: ["$channel", "$$subscriberId"] }
                                ]
                            }
                        }
                    }
                ],
                as: "isSubscribedLookup"
            }
        },
        {
            $addFields: {
                isSubscribed: {
                    $gt: [{ $size: "$isSubscribedLookup" }, 0]
                }
            }
        },
        {
            $project:{
                // username:1,
                // subscribersCount:1,
                // "avatar.url": 1,
                _id: "$subscriberDetails._id",
                username: "$subscriberDetails.username",
                avatar: "$subscriberDetails.avatar",
                isSubscribed: 1
            }
        }
    ]);
    if(!subscribers){
        throw new ApiError(400,"Error fetching subscribers list!");
    }
    console.log(subscribers);
    return res
    .status(200)
    .json(
        new ApiResponse(200,subscribers,"fetched subscribers list successfully!")
    );
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req,res)=>{
    const {subscriberId} = req.params;
    if(!subscriberId){
        throw new ApiError(400,"channel required");
    }
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"invalid channel Id");
    }
    const channels = await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(String(subscriberId))
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"subscribedChannels"
            }
        }
        ,
        {
        $unwind: "$subscribedChannels"
        },
        {
            $project:{
                // username:1,
                // subscribersCount:1,
                // "avatar.url": 1,
                _id: "$subscribedChannels._id",
                username: "$subscribedChannels.username",
                avatar: "$subscribedChannels.avatar"
            }
        }
    ])
    if(!channels){
        throw new ApiError(400,"error fetching subscribed channels");
    }
    // console.log(channels);
    return res
    .status(200)
    .json(
        new ApiResponse(200,channels,"subscribed channels fetched successfully!")
    )


})

export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers
}