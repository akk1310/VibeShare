import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVideoById } from "../store/Slices/videoSlice";
import { PlaylistDropdown } from "../components/index";
import {
  CommentsList,
  TweetAndComment,
  Video,
  Description,
  Spinner,
  InfiniteScroll,
  Navbar,
} from "../components";

import {
  cleanUpComments,
  getVideoComments,
} from "../store/Slices/commentSlice";

const VideoDetail = () => {
  const dispatch = useDispatch();
  const { videoId } = useParams();
  const video = useSelector((state) => state.video?.video);
  const comments = useSelector((state) => state.comment?.comments);
  {
    console.log("comm", comments);
  }
  const totalComments = useSelector((state) => state.comment?.totalComments);
  const hasNextPage = useSelector((state) => state.comment?.hasNextPage);
  const loading = useSelector((state) => state.comment?.loading);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoById({ videoId }));
      dispatch(getVideoComments({ videoId }));
    }

    return () => dispatch(cleanUpComments());
  }, [dispatch, videoId]);

  const fetchMoreComments = useCallback(() => {
    if (!loading && hasNextPage) {
      dispatch(getVideoComments({ videoId, page: page + 1 }));
      setPage((prev) => prev + 1);
    }
  }, [page, loading, hasNextPage, dispatch, videoId]);

  return (
    <>
      <Navbar />
      <Video src={video?.videoFile?.url} poster={video?.thumbnail?.url} />
      <Description
        avatar={video?.owner?.avatar}
        channelName={video?.owner?.username}
        createdAt={video?.createdAt}
        description={video?.description}
        isSubscribed={video?.owner?.isSubscribed}
        likesCount={video?.likesCount}
        subscribersCount={video?.owner?.subscribersCount}
        title={video?.title}
        views={video?.views}
        key={video?._id}
        isLiked={video?.isLiked}
        videoId={video?._id}
        channelId={video?.owner?._id}
      >
        <PlaylistDropdown videoId={video?._id} />
      </Description>
      <div className="text-white ml-20 font-semibold sm:px-5 px-3">
        {totalComments} Comments
      </div>
      {/* <TweetAndComment comment={true} videoId={video?._id} />
      <InfiniteScroll fetchMore={fetchMoreComments} hasNextPage={hasNextPage}>
        <div className="w-full sm:max-w-4xl mb-20">
          {comments?.map((comment) => (
            <CommentsList
              key={comment?._id}
              avatar={comment?.owner?.avatar}
              commentId={comment?._id}
              content={comment?.content}
              createdAt={comment?.createdAt}
              fullName={comment?.owner?.fullName}
              // isLiked={comment?.isLiked}
              // likesCount={comment?.likesCount}
              username={comment?.owner?.username}
              videoId={videoId}
            />
          ))}
          {loading && (
            <div className="w-full flex justify-center items-center">
              <Spinner width={10} />
            </div>
          )}
        </div>
      </InfiniteScroll> */}
      <TweetAndComment comment={true} videoId={video?._id} />

      <div className="text-white font-semibold sm:px-5 px-3">
        {totalComments} Comments
      </div>

      <InfiniteScroll fetchMore={fetchMoreComments} hasNextPage={hasNextPage}>
        <div className="w-full sm:max-w-4xl sm:px-5 px-3 mb-20">
          {comments?.map((comment) => (
            <CommentsList
              key={comment?._id}
              avatar={comment?.owner?.avatar}
              commentId={comment?._id}
              content={comment?.content}
              createdAt={comment?.createdAt}
              fullName={comment?.owner?.fullName}
              username={comment?.owner?.username}
              videoId={videoId}
            />
          ))}
          {loading && (
            <div className="w-full flex justify-center items-center">
              <Spinner width={10} />
            </div>
          )}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default VideoDetail;
