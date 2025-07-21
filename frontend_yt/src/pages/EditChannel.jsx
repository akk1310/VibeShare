import React from "react";
import { ChannelHeader, ChannelNavigate, Spinner } from "../components/index";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const EditChannel = () => {
  //   const channel = useSelector((state) => state.auth?.userData);
  const channel = useSelector((state) => state.user?.profileData);
  const loading = useSelector((state) => state.auth?.loading);
  // window.scrollTo(0, 0);
  return (
    <div className="bg-black">
      {/* {console.log(user)} */}
      {console.log(channel)}
      {loading && (
        <div className="w-full fixed top-20 flex justify-center z-20">
          <div className="w-52 border border-slate-600 bg-black flex gap-2 p-3">
            <Spinner />
            <span className="text-md font-bold text-white">Please wait...</span>
          </div>
        </div>
      )}
      {channel && (
        <ChannelHeader
          username={channel?.username}
          coverImage={channel?.coverImage}
          avatar={channel?.avatar}
          subscribedCount={channel?.subscribersCount}
          isSubscribed={channel?.isSubscribed}
          channelId={channel?._id}
          edit={true}
        />
      )}
      <ChannelNavigate edit={true} />
      <div className=" flex-1 overflow-y-auto scrollbar-hide bg-black pb-20">
        <Outlet />
      </div>
    </div>
  );
};

export default EditChannel;
