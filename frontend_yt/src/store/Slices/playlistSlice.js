import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  playlist: [],
  playlists: [],
};

export const createAPlaylist = createAsyncThunk(
  "createPlaylist",
  async ({ name, description }) => {
    try {
      const response = await axiosInstance.post("/playlist", {
        name,
        description,
      });
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "creating playlist failed";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);
export const addVideoToPlaylist = createAsyncThunk(
  "addVideoToPlaylist",
  async ({ videoId, playlistId }) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/add/${videoId}/${playlistId}`
      );
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data?.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "adding video to playlist failed";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);
export const removeVideoFromPlaylist = createAsyncThunk(
  "removeVideoFromPlaylist",
  async ({ videoId, playlistId }) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/remove/${videoId}/${playlistId}`
      );
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data?.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "failed removing video from playlist!";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);
export const getPlaylistById = createAsyncThunk(
  "getPlaylistById",
  async (playlistId) => {
    try {
      const response = await axiosInstance.get(`/playlist/${playlistId}`);
      // if(response.data?.success){
      //     toast.success(response.data.message);
      // }
      return response.data?.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "failed fetching video from playlist!";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);
export const getPlaylistByUser = createAsyncThunk(
  "getPlaylistsByUser",
  async (userId) => {
    try {
      const response = await axiosInstance.get(`/playlist/user/${userId}`);
      // if(response.data?.success){
      //     toast.success(response.data.message);
      // }
      return response.data?.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "failed fetching playlist";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);
export const updatePlaylist = createAsyncThunk(
  "updatePlaylist",
  async ({ name, description, playlistId }) => {
    try {
      const response = await axiosInstance.patch(`/playlist/${playlistId}`, {
        name,
        description,
      });
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data?.data;
      // return response.data?.playlist;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "failed fetching playlist";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);
export const getPlaylistsByUsername = createAsyncThunk(
  "getPlaylistsByUsername",
  async (username) => {
    const response = await axiosInstance.get(`/playlist/username/${username}`);
    return response.data?.data;
  }
);
export const deletePlaylist = createAsyncThunk(
  "deletePlaylist",
  async (playlistId) => {
    try {
      const response = await axiosInstance.delete(`/playlist/${playlistId}`);
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return playlistId;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "failed deleting playlist";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPlaylistByUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPlaylistById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPlaylistsByUsername.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPlaylistByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.playlists = action.payload;
    });
    builder.addCase(getPlaylistById.fulfilled, (state, action) => {
      state.loading = false;
      state.playlist = action.payload;
      // state.playlist = Array.isArray(action.payload) ? action.payload[0] : action.payload;
    });
    builder.addCase(getPlaylistsByUsername.fulfilled, (state, action) => {
      state.loading = false;
      state.playlists = action.payload;
    });
    builder.addCase(createAPlaylist.fulfilled, (state, action) => {
      state.playlists.push(action.payload); // add to list of playlists
    });

    builder.addCase(addVideoToPlaylist.fulfilled, (state, action) => {
      if (state.playlist?._id === action.payload._id) {
        state.playlist = action.payload; // update selected playlist
      }
      const idx = state.playlists.findIndex(
        (p) => p._id === action.payload._id
      );
      if (idx !== -1) state.playlists[idx] = action.payload;
    });

    builder.addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
      if (state.playlist?._id === action.payload._id) {
        // ✅ Merge the updated fields instead of full overwrite
        state.playlist = {
          ...state.playlist,
          ...action.payload,
        };
      }

      const idx = state.playlists.findIndex(
        (p) => p._id === action.payload._id
      );
      if (idx !== -1) {
        state.playlists[idx] = {
          ...state.playlists[idx],
          ...action.payload,
        };
      }
    });

    builder.addCase(deletePlaylist.fulfilled, (state, action) => {
      state.loading = false;
      state.playlists = state.playlists.filter(
        (playlist) => playlist._id !== action.payload
      );
    });
    builder.addCase(deletePlaylist.rejected, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePlaylist.rejected, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePlaylist.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.playlists.findIndex(
        (pl) => pl._id === action.payload._id
      );
      if (index !== -1) {
        state.playlists[index] = {
          ...state.playlists[index],
          ...action.payload,
        };
      }
    });
  },
});

export default playlistSlice.reducer;
