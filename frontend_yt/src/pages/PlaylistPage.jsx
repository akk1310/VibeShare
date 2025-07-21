import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPlaylistById,
  removeVideoFromPlaylist,
} from "../store/Slices/playlistSlice";
import { timeAgo } from "../helpers/timeAgo";
import { BsThreeDotsVertical } from "react-icons/bs";

function PlaylistPage() {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(null); // video._id of opened menu
  const playlist = useSelector((state) => state.playlist.playlist);
  console.log("play", playlist);

  const loading = useSelector((state) => state.playlist.loading);

  useEffect(() => {
    if (playlistId) {
      dispatch(getPlaylistById(playlistId));
    }
  }, [dispatch, playlistId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <p className="text-white p-4">Loading playlist...</p>;
  }

  // Safe destructuring and fallbacks
  const videos = playlist?.videos || [];
  const views = playlist?.totalViews ?? 0;
  const updatedAt = playlist?.updatedAt ?? new Date().toISOString();
  const owner = Array.isArray(playlist?.ownerDetails)
    ? playlist.ownerDetails[0]
    : playlist?.ownerDetails || {};

  return (
    <div className="p-4 text-white">
      {/* Playlist Banner */}
      <div className="relative w-full h-56 bg-gray-900 rounded-lg overflow-hidden mb-6">
        {/* <img
          src="/defaultThumbnail.webp"
          alt="Playlist thumbnail"
          className="w-full h-full text-white"
        /> */}
        <div className="absolute inset-0 bg-black bg-opacity-50 p-4 flex flex-col justify-end">
          <h2 className="text-2xl font-bold">{playlist.name}</h2>
          <p className="text-sm text-gray-300">{playlist.description}</p>
          <div className="text-sm text-gray-400 mt-1">
            {views} views • {timeAgo(updatedAt)}
          </div>
        </div>
      </div>

      {/* Owner Info */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={owner?.avatar || "/default-avatar.png"}
          alt="Owner Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="text-sm font-semibold">
            {owner?.username || "Unknown"}
          </div>
        </div>
      </div>

      {/* Playlist Videos */}
      {videos.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {videos.map((video) => {
            const toggleMenu = (id) => {
              setShowMenu((prev) => (prev === id ? null : id));
            };

            return (
              <div
                key={video._id}
                className="relative flex bg-[#1c1c1c] rounded overflow-hidden hover:bg-[#222] transition"
              >
                {/* Thumbnail */}
                <img
                  src={video.thumbnail?.url || "/defaultThumbnail.webp"}
                  alt="video thumbnail"
                  className="w-48 h-28 object-cover cursor-pointer"
                  onClick={() => window.location.assign(`/watch/${video._id}`)}
                />

                {/* Info */}
                <div
                  className="p-3 flex flex-col justify-between flex-grow cursor-pointer"
                  onClick={() => window.location.assign(`/watch/${video._id}`)}
                >
                  <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="text-xs text-gray-500 mt-1">
                    {video.views || 0} views •{" "}
                    {video.createdAt ? timeAgo(video.createdAt) : "just now"}
                  </div>
                </div>

                {/* 3-dot menu */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent video click
                      toggleMenu(video._id);
                    }}
                    className="text-white hover:text-gray-300"
                  >
                    <BsThreeDotsVertical />
                  </button>

                  {/* Dropdown menu */}
                  {showMenu === video._id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-40 bg-[#222] text-white rounded shadow-md z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          dispatch(
                            removeVideoFromPlaylist({
                              playlistId,
                              videoId: video._id,
                            })
                          ).then(() => {
                            dispatch(getPlaylistById(playlistId)); // ✅ Refresh state
                          });
                          setShowMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white text-sm"
                      >
                        Remove from Playlist
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">No videos in this playlist yet.</p>
      )}
    </div>
  );
}

export default PlaylistPage;
