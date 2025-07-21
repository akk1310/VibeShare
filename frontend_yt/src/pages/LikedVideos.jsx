import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLikedVideos } from "../store/Slices/likeSlice";
import HomeTemplate from "../templates/HomeTemplate";
import {
  Container,
  NoVideosFound,
  VideoVerticalList,
  VideoList,
} from "../components/index";
import { makeVideosNull } from "../store/Slices/videoSlice";

const LikedVideos = () => {
  const dispatch = useDispatch();
  const likedvideos = useSelector((state) => state.like?.likedVideos);
  {console.log("vid",likedvideos)}
  const loading = useSelector((state) => state.like.loading);
  useEffect(() => {
    dispatch(getLikedVideos());
    return () => dispatch(makeVideosNull());
  }, [dispatch]);
  if (loading) {
    return <HomeTemplate />;
  }

  if (likedvideos?.length == 0) {
    return <NoVideosFound />;
  }

  return (
    <>
      <Container>
        <div className="grid max-h-screen overflow-y-scroll lg:grid-cols-3 sm:grid-cols-2 text-white mb-20 sm:mb-0">
          {likedvideos?.map((video) => (
               
            <VideoList
              key={video.likedVideos._id}
              avatar={video.likedVideos.ownerDetails?.avatar}
              duration={video.likedVideos.duration}
              title={video.likedVideos.title}
              thumbnail={video.likedVideos.thumbnail?.url}
              createdAt={video.likedVideos.createdAt}
              views={video.likedVideos.views}
              channelName={video.likedVideos.ownerDetails?.username}
              videoId={video.likedVideos._id}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

export default LikedVideos;
