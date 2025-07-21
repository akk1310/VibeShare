import React, { useEffect } from "react";
import { getUserChannelSubscribers } from "../../store/Slices/subscriptionSlice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button } from "../../components/index";
import { Link } from "react-router-dom";
import { toggleSubscription } from "../../store/Slices/subscriptionSlice";
import { userChannelProfile } from "../../store/Slices/userSlice.js";
import { FaUsers } from "react-icons/fa"; 

const ChannelSubscribers = () => {
  const dispatch = useDispatch();
  const channelId = useSelector((state) => state.user.profileData?._id);
  const currentUserId = useSelector((state) => state.auth?.userData?._id);
  const currentUsername = useSelector((state) => state.auth?.userData?.username);

  const subscribers = useSelector(
    (state) => state.subscription?.channelSubscribers || []
  );

  useEffect(() => {
    if (channelId) {
      dispatch(getUserChannelSubscribers(channelId));
    }
  }, [dispatch, channelId,subscribers]);
  const handleToggleSubscription = async (subscriberId) => {
    await dispatch(toggleSubscription(subscriberId));
    // Refresh list after toggling
    dispatch(getUserChannelSubscribers(channelId));
    dispatch(userChannelProfile(currentUsername));
  };

  return (
    <>
      {subscribers.length === 0 ? (
      <div className="flex flex-col justify-center items-center text-white py-10">
        <div className="bg-purple-300 text-purple-700 p-4 rounded-full mb-3">
          <FaUsers size={40} />
        </div>
        <p className="font-bold text-lg">No subscribers yet</p>
        <p className="text-sm text-slate-400 mt-1">
          This channel has yet to <span className="font-semibold">subscribe</span> by any user.
        </p>
      </div>
    ) : (
      subscribers.map((subscriber) => (
        <div
          key={subscriber?._id}
          className="flex border-b border-slate-500 px-3 py-1 justify-between items-center text-white"
        >
          <Link to={`/channel/${subscriber?.username}`} className="flex gap-3 items-center">
            <Avatar src={subscriber?.avatar} channelName={subscriber?.username} />
            <div>
              <h5 className="text-sm">{subscriber?.username}</h5>
            </div>
          </Link>

          {subscriber?._id !== currentUserId && (
            <Button
              onClick={() => handleToggleSubscription(subscriber?._id)}
              className={`text-xs py-1 px-2 transition-all duration-200 ${
                subscriber?.isSubscribed
                  ? "bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black"
                  : "bg-purple-500 text-black hover:brightness-110"
              }`}
            >
              {subscriber?.isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
        </div>
      ))
    )}
    </>
  );
};

export default ChannelSubscribers;
