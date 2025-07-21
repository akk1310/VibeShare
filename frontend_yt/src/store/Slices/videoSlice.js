import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constants";

const initialState = {
  loading: false,
  uploading: false,
  uploaded: false,
  videos: {
    docs: [],
    hasNextPage: false,
  },
  video: null,
  publishToggled: true,
};

// export const getAllVideos = createAsyncThunk("getAllVideos",
//     async({ sortBy = "createdAt", sortType = "desc" } = {})=>{
//     try {
//         const response = await axiosInstance.get(`/videos?sortBy=${sortBy}&sortType=${sortType}`);
//         console.log(response.data.data);
//         return response.data.data;
//     } catch (error) {
//         toast.error(error?.response?.data?.error);
//         console.log(error?.response?.data);
//         console.log("error",error?.response?.data?.data);
//         throw error;
//     }
// })
export const getAllVideos = createAsyncThunk(
  "getAllVideos",
  async ({ userId, sortBy, sortType, query, page, limit }) => {
    try {
      const url = new URL(`${BASE_URL}/videos`);

      if (userId) url.searchParams.set("userId", userId);
      if (query) url.searchParams.set("query", query);
      if (page) url.searchParams.set("page", page);
      if (limit) url.searchParams.set("limit", limit);
      if (sortBy && sortType) {
        url.searchParams.set("sortBy", sortBy);
        url.searchParams.set("sortType", sortType);
      }

      const response = await axiosInstance.get(url);

      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);

export const publishAVideo = createAsyncThunk("publishAVideo", async (data) => {
  console.log("Received data:", data);
  const formData = new FormData();

  try {
    const videoFile = data.videoFile?.[0];
    const thumbnailFile = data.thumbnail?.[0];

    if (!videoFile) throw new Error("Video file is missing");
    if (!thumbnailFile) throw new Error("Thumbnail file is missing");

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    console.log("Sending FormData:", [...formData.entries()]); // Debug

    const response = await axiosInstance.post("/videos/upload", formData);
    toast.success(response?.data?.message || "Video uploaded successfully!");
    return response.data.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message || error?.message || "Upload failed";
    toast.error(`❌ ${msg}`);
    console.error("Upload error:", error);
    // return thunkAPI.rejectWithValue(msg);
  }
});

export const updateAVideo = createAsyncThunk(
  "updateAVideo",
  async ({ videoId, data }) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail[0]);

    try {
      const response = await axiosInstance.patch(
        `/videos/${videoId}`,
        formData
      );
      toast.success(response?.data?.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data);
      console.log("error", error?.response?.data?.data);
      throw error;
    }
  }
);

export const deleteAVideo = createAsyncThunk(
  "deleteAVideo",
  async (videoId) => {
    try {
      const response = await axiosInstance.delete(`/videos/${videoId}`);
      toast.success(response?.data?.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      
      throw error;
    }
  }
);

export const getVideoById = createAsyncThunk(
  "getVideoById",
  async ({ videoId }) => {
    try {
      const response = await axiosInstance.get(`/videos/${videoId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data);
      console.log("error", error?.response?.data?.data);
      throw error;
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  "togglePublishStatus",
  async (videoId) => {
    try {
      const response = await axiosInstance.patch(
        `/videos/toggle/publish/${videoId}`
      );
      console.log("toast msg", response.data.message);
      toast.success(response.data.message);
      return response.data.data.isPublished;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      
      throw error;
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    updateUploadState: (state) => {
      state.uploading = false;
      state.uploaded = false;
    },
    makeVideosNull: (state) => {
      state.videos.docs = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllVideos.pending, (state) => {
      state.loading = true;
    });
    // builder.addCase(getAllVideos.fulfilled,(state,action)=>{
    //     state.loading=false;
    //     state.videos.docs = [...state.videos.docs,...action.payload];
    //     // state.videos.hasNextPage = action.payload.hasNextPage;
    //     state.videos.hasNextPage = false;
    // })
    builder.addCase(getAllVideos.fulfilled, (state, action) => {
      state.loading = false;

      if (Array.isArray(action.payload)) {
        // fallback when payload is a plain array
        state.videos.docs = [...state.videos.docs, ...action.payload];
        state.videos.hasNextPage = false;
      } else if (action.payload?.docs) {
        state.videos.docs = [...state.videos.docs, ...action.payload.docs];
        state.videos.hasNextPage = action.payload.hasNextPage;
      } else {
        state.videos.docs = [];
        state.videos.hasNextPage = false;
      }
    });

    builder.addCase(publishAVideo.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(publishAVideo.fulfilled, (state) => {
      state.uploading = false;
      state.uploaded = true;
    });
    builder.addCase(updateAVideo.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(updateAVideo.fulfilled, (state) => {
      state.uploading = false;
      state.uploaded = true;
    });
    builder.addCase(deleteAVideo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAVideo.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getVideoById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getVideoById.fulfilled, (state, action) => {
      state.loading = false;
      state.video = action.payload;
    });
    builder.addCase(togglePublishStatus.fulfilled, (state) => {
      state.publishToggled = !state.publishToggled;
    });
  },
});

export const { updateUploadState, makeVideosNull } = videoSlice.actions;

export default videoSlice.reducer;
