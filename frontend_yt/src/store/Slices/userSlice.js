import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    loading: false,
    profileData: null,
    history: [],
};

export const userChannelProfile = createAsyncThunk("getUserChannelProfile",async(username)=>{
    try {
        const response = await axiosInstance.get(`/users/c/${username}`)
        console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
})

export const getWatchHistory = createAsyncThunk("getWatchHistory", async () => {
    try {
        const response = await axiosInstance.get("/users/history");
        console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(userChannelProfile.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(userChannelProfile.fulfilled,(state,action)=>{
            state.loading=false;
            state.profileData=action.payload;
        })
        builder.addCase(getWatchHistory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getWatchHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.history = action.payload;
        });
    }
})

export default userSlice.reducer;