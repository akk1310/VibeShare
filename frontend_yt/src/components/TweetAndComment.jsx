// import React from "react";
// import Button from "./Button";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { createTweet } from "../store/Slices/tweetSlice";
// import { getUserTweets } from "../store/Slices/tweetSlice";
// import {createAComment} from "../store/Slices/commentSlice";

// const TweetAndComment = ({ tweet, channelId, videoId, comment }) => {
//   const { register, handleSubmit, setValue } = useForm();
//   const dispatch = useDispatch();

//   const sendContent = (data) => {
//     if (data) {
//       if (tweet) {
        
//         dispatch(createTweet({ content: data.content, channelId })).then(() => {
//           dispatch(getUserTweets(channelId));
//           });

//       } else if (comment) {
//         dispatch(createAComment({ content: data.content, videoId }))
       
//       }
//       setValue("content", "");
//     }
//   };
 
//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(sendContent)}
//         className="sm:p-5 p-3 sm:max-w-4xl ml-18 w-full relative"
//       >
//         <textarea
//           placeholder={`${tweet ? "Write a tweet" : "Add a Comment"}`}
//           className="p-2 text-sm pr-16 focus:border-white text-white border border-slate-500 bg-[#222222] outline-none w-full"
//           {...register("content", { required: true })}
//           rows={2}
//         />
//         <Button
//           type="submit"
//           className="bg-purple-500 px-2 py-1 text-black hover:scale-110 transition-all ease-in absolute sm:bottom-8 sm:right-8 bottom-8 right-4 text-xs sm:text-base"
//         >
//           Send
//         </Button>
//       </form>
//     </>
//   );
// };

// export default TweetAndComment;

import React from "react";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createTweet, getUserTweets } from "../store/Slices/tweetSlice";
import { createAComment } from "../store/Slices/commentSlice";

const TweetAndComment = ({ tweet, channelId, videoId, comment }) => {
  const { register, handleSubmit, setValue } = useForm();
  const dispatch = useDispatch();

  const sendContent = (data) => {
    if (!data?.content?.trim()) return;

    if (tweet) {
      dispatch(createTweet({ content: data.content, channelId })).then(() => {
        dispatch(getUserTweets(channelId));
      });
    } else if (comment) {
      dispatch(createAComment({ content: data.content, videoId }));
    }

    setValue("content", "");
  };

  return (
    <div className="flex flex-col items-center sm:items-start w-full mt-6 px-3 sm:px-20">
      <form
        onSubmit={handleSubmit(sendContent)}
        className="w-full sm:max-w-4xl"
      >
        <div className="relative">
          <textarea
            placeholder={tweet ? "Write a tweet" : "Add a comment"}
            {...register("content", { required: true })}
            rows={2}
            className="w-full bg-[#1e1e1e] text-white border border-zinc-700 rounded-md p-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
          />

          <Button
            type="submit"
            className="absolute bottom-2 right-2 bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700 transition"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TweetAndComment;


