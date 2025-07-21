import React,{useState} from "react";
import {addVideoToPlaylist,createAPlaylist} from "../store/Slices/playlistSlice";
import { useDispatch } from "react-redux";
const NewPlaylistForm = ({ videoId }) => {
  const [playlistName, setPlaylistName] = useState("");
  const dispatch = useDispatch();

  const handleCreate = () => {
    if (!playlistName.trim()) return;
    dispatch(createAPlaylist({ name: playlistName, description: "default" }))
      .then((res) => {
        console.log(res)
        const newPlaylistId = res.payload._id;
        dispatch(addVideoToPlaylist({ playlistId: newPlaylistId, videoId }));
        setPlaylistName("");
      });
  };

  return (
    <div className="mt-3">
      <input
        type="text"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        placeholder="Enter playlist name"
        className="w-full p-2 bg-gray-800 rounded text-sm"
      />
      <button
        onClick={handleCreate}
        className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
      >
        Create new playlist
      </button>
    </div>
  );
};
export default NewPlaylistForm;