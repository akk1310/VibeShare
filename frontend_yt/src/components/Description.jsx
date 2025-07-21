
// import React, { useState } from "react";
// import { timeAgo } from "../helpers/timeAgo";
// import { Like, Button } from "./index";
// import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { toggleSubscription } from "../store/Slices/subscriptionSlice";

// const Description = ({
//   title,
//   views,
//   createdAt,
//   channelName,
//   avatar,
//   subscribersCount,
//   likesCount,
//   isSubscribed,
//   description,
//   isLiked,
//   videoId,
//   channelId,
//   children,
// }) => {
//   const [localIsSubscribed, setLocalIsSubscribed] = useState(isSubscribed);
//   const [localSubscribersCount, setLocalSubscribersCount] =
//     useState(subscribersCount);

//   const dispatch = useDispatch();

//   const handleSubscribe = () => {
//     dispatch(toggleSubscription(channelId));
//     setLocalIsSubscribed((prev) => !prev);
//     setLocalSubscribersCount((prev) =>
//       localIsSubscribed ? prev - 1 : prev + 1
//     );
//   };

//   return (
//     <section className="sm:max-w-4xl w-full ml-20 text-white sm:p-5 p-3 space-y-4">
//       {/* Title & Meta */}
//       <div className="border-b border-slate-700 pb-4">
//         <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>
//         <div className="flex flex-wrap sm:justify-start justify-between items-center gap-4 mt-2">
//           <div className="text-sm text-slate-400">
//             {views} views • {timeAgo(createdAt)}
//           </div>
//           <div className="bg-[#1c1c1c] hover:bg-[#2b2b2b] transition-colors rounded-full px-4 py-1">
//             <Like
//               isLiked={isLiked}
//               videoId={videoId}
//               likesCount={likesCount}
//               size={22}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Channel Info + Subscribe */}
//       <div className="flex  justify-between items-center flex-wrap gap-4">
//         <Link to={`/channel/${channelName}/videos`} className="flex gap-3 items-center">
//           <img
//             src={avatar}
//             className="w-15 h-15 rounded-full object-cover border border-slate-600"
//             alt="Channel Avatar"
//           />
//           <div>
//             <h2 className="font-medium">{channelName}</h2>
//             <p className="text-xs text-slate-400">{localSubscribersCount} Subscribers</p>
//           </div>
//         </Link>

//         <div className="flex gap-4 justify-center items-center">
        
//         {children}
//         <Button
//           onClick={handleSubscribe}
//           className={`px-5 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
//             localIsSubscribed
//               ? "bg-slate-700 text-white hover:bg-slate-600"
//               : "bg-purple-500 text-white hover:bg-purple-600"
//           }`}
//         >
//           {localIsSubscribed ? "Subscribed" : "Subscribe"}
//         </Button>
//         </div>

//       </div>

//       {/* Description */}
//       <p className="text-sm leading-relaxed  bg-[#1a1a1a] border border-slate-700 rounded-md p-3">
//         <p className="text-xs  text-shadow-white font-light">#description</p>
//         {description}
//       </p>
       
//     </section>
//   );
// };

// export default Description;

import React, { useState } from "react";
import { timeAgo } from "../helpers/timeAgo";
import { Like, Button } from "./index";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleSubscription } from "../store/Slices/subscriptionSlice";

const Description = ({
  title,
  views,
  createdAt,
  channelName,
  avatar,
  subscribersCount,
  likesCount,
  isSubscribed,
  description,
  isLiked,
  videoId,
  channelId,
  children,
}) => {
  const [localIsSubscribed, setLocalIsSubscribed] = useState(isSubscribed);
  const [localSubscribersCount, setLocalSubscribersCount] = useState(subscribersCount);

  const dispatch = useDispatch();

  const handleSubscribe = () => {
    dispatch(toggleSubscription(channelId));
    setLocalIsSubscribed((prev) => !prev);
    setLocalSubscribersCount((prev) =>
      localIsSubscribed ? prev - 1 : prev + 1
    );
  };

  return (
    <section className="sm:max-w-4xl w-full ml-0 sm:ml-20 text-white sm:p-5 p-3 space-y-4">
      {/* Title & Meta */}
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>
        <div className="flex flex-wrap justify-between items-center gap-4 mt-2">
          <div className="text-sm text-slate-400">
            {views} views • {timeAgo(createdAt)}
          </div>
          <div className="bg-[#1c1c1c] hover:bg-[#2b2b2b] transition-colors rounded-full px-4 py-1">
            <Like
              isLiked={isLiked}
              videoId={videoId}
              likesCount={likesCount}
              size={22}
            />
          </div>
        </div>
      </div>

      {/* Channel Info + Subscribe */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
        <Link
          to={`/channel/${channelName}/videos`}
          className="flex items-center gap-3"
        >
          <img
            src={avatar}
            alt="Channel Avatar"
            className="w-12 h-12 rounded-full object-cover border border-slate-600"
          />
          <div>
            <h2 className="font-medium">{channelName}</h2>
            <p className="text-xs text-slate-400">
              {localSubscribersCount} Subscribers
            </p>
          </div>
        </Link>

        <div className="flex gap-3 flex-shrink-0">
          {children}
          <Button
            onClick={handleSubscribe}
            className={`px-5 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
              localIsSubscribed
                ? "bg-slate-700 text-white hover:bg-slate-600"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            {localIsSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm leading-relaxed bg-[#1a1a1a] border border-slate-700 rounded-md p-3 space-y-1">
        <p className="text-xs text-shadow-white font-light">#description</p>
        <p>{description}</p>
      </div>
    </section>
  );
};

export default Description;
