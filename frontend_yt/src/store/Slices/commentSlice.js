import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constants";
import { toggleCommentLike } from "./likeSlice";

const initialState = {
  loading: false,
  comments: [],
  totalComments: null,
  hasNextPage: false,
};

export const createAComment = createAsyncThunk(
  "createComment",
  async ({ videoId, content }) => {
    try {
      console.log("vidId", { videoId, content });
      const response = await axiosInstance.post(`/comments/${videoId}`, {
        content,
      });
      return response.data.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Comment creation failed";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);

export const editAComment = createAsyncThunk(
  "editAComment",
  async ({ commentId, updatedContent }) => {
    try {
      const response = await axiosInstance.patch(`/comments/c/${commentId}`, {
        updatedContent,
      });
      toast.success(response.data?.message);
      return response.data.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Comment creation failed";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);

export const deleteAComment = createAsyncThunk(
  "deleteAComment",
  async (commentId) => {
    try {
      const response = await axiosInstance.delete(`/comments/c/${commentId}`);
      toast.success(response.data.message);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Comment creation failed";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);

export const getVideoComments = createAsyncThunk(
  "getVideoComments",
  async ({ videoId, page, limit }) => {
    if (!videoId) {
      throw new Error("videoId is required to fetch comments");
    }
    let url;
    console.log("final", videoId);
    if (videoId) {
      url = new URL(`${BASE_URL}/comments/${videoId}`);
    }
    if (page) url.searchParams.set("page", page);
    if (limit) url.searchParams.set("limit", limit);

    try {
      const response = await axiosInstance.get(url);
      return response.data.data;
    } catch (error) {
      console.log("here err");
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Comment creation failed";
      toast.error(`❌ ${msg}`);
      throw error;
    }
  }
);
const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    cleanUpComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getVideoComments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getVideoComments.fulfilled, (state, action) => {
      state.loading = false;
      const page = action.meta.arg?.page || 1;

      // If it's page 1 (initial load or refresh), replace the comments
      if (page === 1) {
        state.comments = [...action.payload.docs];
      } else {
        // For pagination, append
        state.comments = [...state.comments, ...action.payload.docs];
      }

      state.totalComments = action.payload.totalDocs;
      state.hasNextPage = action.payload.hasNextPage;
    });
    builder.addCase(createAComment.fulfilled, (state, action) => {
      state.comments.unshift(action.payload);
      state.totalComments++;
    });
    builder.addCase(deleteAComment.fulfilled, (state, action) => {
      state.loading = false;
      // Get commentId from action.meta.arg instead
      const deletedId = action.meta.arg;
      state.comments = state.comments.filter(
        (comment) => comment._id !== deletedId
      );
      state.totalComments--;
    });
    builder.addCase(editAComment.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload;
      const index = state.comments.findIndex((c) => c._id === updated._id);
      if (index !== -1) {
        state.comments[index].content = updated.content;
      }
    });
    builder.addCase(getVideoComments.rejected, (state) => {
      state.loading = false; // Stop spinner on error
    });
    builder.addCase(toggleCommentLike.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.comments.findIndex((c) => c._id === updated._id);
      if (index !== -1) {
        state.comments[index].isLiked = updated.isLiked;
        state.comments[index].likesCount = updated.likesCount;
      }
    });
  },
});

export const { cleanUpComments } = commentSlice.actions;

export default commentSlice.reducer;
