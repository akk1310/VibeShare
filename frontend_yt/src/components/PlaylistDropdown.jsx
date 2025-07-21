import React, { useState } from "react";
import {
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylistByUser,
} from "../store/Slices/playlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { NewPlaylistForm } from "./index";

const PlaylistDropdown = ({ videoId }) => {
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [localPlaylists, setLocalPlaylists] = useState([]);
  const userData = useSelector((state) => state.auth.userData);

  const fetchPlaylists = async () => {
    if (!userData?._id) return;
    try {
      const res = await dispatch(getPlaylistByUser(userData._id)).unwrap();
      setLocalPlaylists(res);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    }
  };

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => {
      const next = !prev;
      if (next) fetchPlaylists();
      return next;
    });
  };

  const toggleVideoInPlaylist = (playlistId, isInPlaylist) => {
    if (isInPlaylist) {
      dispatch(removeVideoFromPlaylist({ playlistId, videoId }));
    } else {
      dispatch(addVideoToPlaylist({ playlistId, videoId }));
    }
  };

  return (
    <div className="relative">
      <button
        className="cursor-pointer px-2 bg-purple-500 text-white hover:bg-purple-600 rounded p-1"
        onClick={handleDropdownToggle}
      >
        Save
      </button>

      {showDropdown && (
        <div className="absolute right-0 bg-black text-white rounded-md w-64 shadow-lg p-3 z-50">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Save to playlist</p>
            <button
              onClick={() => setShowDropdown(false)}
              className="text-xs text-red-500 hover:text-white"
            >
              ✕ Cancel
            </button>
          </div>

          {localPlaylists?.length > 0 ? (
            localPlaylists.map((playlist) => {
              const isInPlaylist = playlist.videos?.some(
                (video) => video._id === videoId
              );
              return (
                <label
                  key={playlist._id}
                  className="flex items-center space-x-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={isInPlaylist}
                    onChange={() =>
                      toggleVideoInPlaylist(playlist._id, isInPlaylist)
                    }
                  />
                  <span>{playlist.name}</span>
                </label>
              );
            })
          ) : (
            <p className="text-sm text-gray-400">No playlists yet</p>
          )}

          <NewPlaylistForm
            videoId={videoId}
            onSuccess={() => setShowDropdown(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PlaylistDropdown;
