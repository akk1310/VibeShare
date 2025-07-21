import React, { useEffect } from "react";
import { Container, NoVideosFound, VideoList,VideoVerticalList } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getWatchHistory } from "../store/Slices/userSlice";
import HomeTemplate from "../templates/HomeTemplate";

function History() {
  const loading = useSelector((state) => state.user?.loading);
  const videos = useSelector((state) => state.user?.history);
  const dispatch = useDispatch();
  // window.scrollTo(0, 0);
  useEffect(() => {
    dispatch(getWatchHistory());
  }, [dispatch]);

  if (loading) {
    return <HomeTemplate />;
  }

  if (videos?.length == 0) {
    return <NoVideosFound />;
  }

//   key={video._id}
// avatar={video.owner?.avatar.url}
// duration={video.duration}
// title={video.title}
// thumbnail={video.thumbnail?.url}
// createdAt={video.createdAt}
// views={video.views}
// channelName={video.owner.username}
// videoId={video._id}

  if (videos && videos.length > 0) {
    return (
      <>
        <Container>
          <div className="flex flex-col gap-4 p-2">
            {videos?.map((video) => (
              <VideoVerticalList
                key={video._id}
                avatar={video.owner?.avatar}
                duration={video.duration}
                title={video.title}
                channelName={video.owner?.username}
                thumbnail={video.thumbnail?.url}
                createdAt={video.createdAt}
                views={video.views}
                videoId={video._id}
                description={video.description}
              />
            ))}
          </div>
        </Container>
      </>
    );
  }
  return (
    <>
      {" "}
      <h1>Error,Reload</h1>{" "}
    </>
  );
}

export default History;
