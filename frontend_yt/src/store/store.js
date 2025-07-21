import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/authSlice.js";
import userSliceReducer from "./Slices/userSlice.js";
import videoSliceReducer from "./Slices/videoSlice.js";
import dashboardSliceReducer from "./Slices/dashboardSlice.js";
import subscriptionSliceReducer from "./Slices/subscriptionSlice.js";
import tweetSliceReducer from "./Slices/tweetSlice.js";
import commentSliceReducer from "./Slices/commentSlice.js";
import likeSliceReducer from "./Slices/likeSlice.js";
import playlistSliceReducer from "./Slices/playlistSlice.js";

const store = configureStore({
    reducer:{
        auth:authSliceReducer,
        user:userSliceReducer,
        video:videoSliceReducer,
        dashboard:dashboardSliceReducer,
        subscription:subscriptionSliceReducer,
        tweet:tweetSliceReducer,
        comment:commentSliceReducer,
        like:likeSliceReducer,
        playlist:playlistSliceReducer,
    }
})

export default store;