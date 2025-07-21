import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    loading: false,
    tweets: [],
};

export const createTweet = createAsyncThunk("createTweet",async({content,channelId})=>{
    try {
        const response = await axiosInstance.post(`/tweets/${channelId}`, {content});
        toast.success(response.data?.message);
        return response.data.data;
    } catch (error) {
        const msg = error?.response?.data?.message || error?.message || "Tweet creation failed";
        toast.error(`❌ ${msg}`);
        throw error;
    }
})

export const editTweet = createAsyncThunk(
    "editTweet",
    async ({ tweetId, updatedContent }) => {
        try {
            console.log("con:",updatedContent)
            const response = await axiosInstance.patch(
                `/tweets/${tweetId}`,
                {updatedContent}
            );
            toast.success(response.data.message);
            return response.data.data;
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Edit tweet failed";
            toast.error(`❌ ${msg}`);
            throw error;
        }
    }
);

export const deleteTweet = createAsyncThunk("deleteTweet", async (tweetId) => {
    try {
        const response = await axiosInstance.delete(`/tweets/${tweetId}`);
        toast.success(response.data.message);
        // return response.data.data.tweetId;
        return tweetId;
    } catch (error) {
        const msg = error?.response?.data?.message || error?.message || "delete tweet failed";
        toast.error(`❌ ${msg}`);
        throw error;
    }
});

export const getUserTweets = createAsyncThunk( "getUserTweets", async (channelId) => {
        try {
            const response = await axiosInstance.get(`/tweets/user/${channelId}`);
            return response.data.data;
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "fetching user failed";
            toast.error(`❌ ${msg}`);
            throw error;
        }
    }
);

const tweetSlice = createSlice({
    name: "tweet",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase( getUserTweets.pending, (state) => {
            state.loading = true;
        }
        );
        builder.addCase(getUserTweets.fulfilled, (state, action) => {
            state.loading = false;
            state.tweets = action.payload;
        });
        builder.addCase(createTweet.pending, (state) => {
            state.loading = true;

        })
        builder.addCase(createTweet.fulfilled, (state, action) => {
            state.loading = true;
            state.tweets.unshift(action.payload);
        })
        
        builder.addCase(deleteTweet.fulfilled, (state, action) => {
            state.tweets = state.tweets.filter((tweet) => tweet._id !== action.payload);
        })
    },
});

export const {addTweet} = tweetSlice.actions;

export default tweetSlice.reducer;