import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPlaylistsByUsername,
  createAPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../../store/Slices/playlistSlice";
import { timeAgo } from "../../helpers/timeAgo";
import { EditPlaylistForm, DeleteConfirmation } from "../../components/index";

function ChannelPlaylists() {
  const { username } = useParams();
  const dispatch = useDispatch();

  const playlists = useSelector((state) => state.playlist.playlists || []);
  //   const channel = useSelector((state) => state.user?.profileData);
  const user = useSelector((state) => state.auth?.userData?.username);
  console.log("usr", user);
  const isOwner = user === username;
  console.log("own", isOwner);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState(null);

  useEffect(() => {
    if (username) {
      dispatch(getPlaylistsByUsername(username));
    }
  }, [dispatch, username]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;
    await dispatch(createAPlaylist(formData));
    setFormData({ name: "", description: "" });
    setShowForm(false);
    dispatch(getPlaylistsByUsername(username)); // Refresh list
  };

  return (
    <div className="text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Playlists</h2>
        {isOwner && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
          >
            {showForm ? "Cancel" : "Create Playlist"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#111] border border-gray-700 p-4 rounded mb-6"
        >
          <div className="mb-4">
            <label className="block mb-1 text-sm">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter playlist name"
              className="w-full px-3 py-2 bg-[#222] text-white border border-gray-600 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description for your playlist"
              className="w-full px-3 py-2 bg-[#222] text-white border border-gray-600 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Create Playlist
          </button>
        </form>
      )}

      {playlists.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-[#1a1a1a] hover:bg-[#222] transition rounded shadow p-3 cursor-pointer"
              onClick={() =>
                window.location.assign(`/playlist/${playlist._id}`)
              }
            >
              <div className="relative w-full h-40 mb-3 overflow-hidden rounded">
                <img
                  src={
                    playlist?.videos?.[0]?.thumbnail?.url ||
                    "/defaultThumbnail.webp"
                  }
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-3 py-1 text-xs flex justify-between text-white">
                  <span>Playlist</span>
                  <span>{playlist.totalVideos} videos</span>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <h3 className="text-base font-semibold mb-1">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-1">
                    {playlist.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    {playlist.totalViews} views • {timeAgo(playlist.updatedAt)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={playlist.ownerDetails?.[0]?.avatar}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-white">
                      {playlist.ownerDetails?.[0]?.username}
                    </span>
                  </div>
                </div>
                <div className="text-white">
                  {isOwner && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlaylist(playlist); // Open edit modal
                        }}
                        className="text-sm bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingPlaylist(playlist); // Open delete modal
                        }}
                        className="text-sm bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No playlists created yet.</p>
      )}
      {editingPlaylist && (
        <EditPlaylistForm
          playlist={editingPlaylist}
          onCancel={() => setEditingPlaylist(null)}
          onSave={async (data) => {
            await dispatch(
              updatePlaylist({
                playlistId: editingPlaylist._id,
                name: data.name,
                description: data.description,
              })
            );
            setEditingPlaylist(null);
            dispatch(getPlaylistsByUsername(username)); // ✅ refresh updated data
          }}
        />
      )}

      {deletingPlaylist && (
        <DeleteConfirmation
          video={false}
          tweet={false}
          comment={false}
          onCancel={() => setDeletingPlaylist(null)}
          onDelete={() => {
            dispatch(deletePlaylist(deletingPlaylist._id));
            setDeletingPlaylist(null);
          }}
        />
      )}
    </div>
  );
}

export default ChannelPlaylists;
