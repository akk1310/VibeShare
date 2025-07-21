import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubscribedChannels } from "../store/Slices/subscriptionSlice";
import { Link } from "react-router-dom";
import { VideoList, Avatar } from "../components";
import { FaUsers } from "react-icons/fa";

const MySubscriptions = () => {
  const dispatch = useDispatch();
  const subscriptions = useSelector(
    (state) => state.subscription?.mySubscriptions
  );
  const subscriberId = useSelector((state) => state.auth?.userData?._id);
  useEffect(() => {
    if (subscriptions) {
      dispatch(getSubscribedChannels(subscriberId));
    }
  }, [dispatch, subscriberId]);
  return (
    <div className="text-white py-4 px-2">
        <h2 className="text-purple-700 text-3xl ml-3 font-semibold underline decoration-white underline-offset-8">My Subscriptions</h2>
      {subscriptions?.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-white py-10">
          <div className="bg-purple-300 text-purple-700 p-4 rounded-full mb-3">
            <FaUsers size={40} />
          </div>
          <p className="font-bold text-lg">No channel subscriptions</p>
          <p className="text-sm text-slate-400 mt-1">
            You haven't <span className="font-semibold">subscribed</span> to any
            channels yet.
          </p>
        </div>
      ) : (
        subscriptions?.map((channel) => {
          return (
            <Link
              to={`/channel/${channel?.username}`}
              key={channel?._id}
              className="flex border-b h-20 border-slate-500 px-3 py-2 justify-between items-center"
            >
              <div className="flex gap-3 items-center">
                <Avatar
                  src={channel?.avatar} // Ensure this is defined
                  channelName={channel?.username}
                />
                <div>
                  <h5 className="text-sm font-medium">{channel?.username}</h5>
                  {/* <span className="text-xs text-slate-400">
                    {channel?.subscribersCount || 0} Subscribers
                  </span> */}
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default MySubscriptions;
