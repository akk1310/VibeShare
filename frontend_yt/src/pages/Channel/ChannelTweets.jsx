import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserTweets } from "../../store/Slices/tweetSlice";
import { TweetAndComment, TweetsList } from "../../components";

const ChannelTweets = () => {
    const dispatch = useDispatch();
    // const authId = useSelector((state) => state.auth?.userData?._id);
    // const userId = useSelector((state) => state.user?.profileData?._id);
    const channelId = useSelector((state) => state.user?.profileData?._id);
    const tweets = useSelector((state) => state.tweet?.tweets);

    useEffect(() => {
        if (channelId) dispatch(getUserTweets(channelId));
    }, [dispatch, channelId]);

 return (
        <>
            {/* {authId === userId && <TweetAndComment tweet={true} channelId={channelId}/>} // only channel owner can tweet */}
            <TweetAndComment tweet={true} channelId={channelId}/>
            {tweets?.map((tweet) => (
                <TweetsList
                    key={tweet?._id}
                    avatar={tweet?.owner?.avatar}
                    content={tweet?.content}
                    createdAt={tweet?.createdAt}
                    likesCount={tweet?.likesCount}
                    tweetId={tweet?._id}
                    username={tweet?.owner?.username}
                    isLiked={tweet?.isLiked}
                />
            ))}
        </>
    );
}

export default ChannelTweets;
