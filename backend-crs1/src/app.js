import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { ApiError } from "./utils/ApiError.js";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//Routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import playlistRouter from "./routes/playlist.routes.js"
import likeRouter from "./routes/like.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import healthCheckRouter from "./routes/healthChecker.routes.js";

//Routes declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/tweets",tweetRouter);
app.use("/api/v1/subscriptions",subscriptionRouter);
app.use("/api/v1/comments",commentRouter);
app.use("/api/v1/playlist",playlistRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/dashboard",dashboardRouter);
app.use("/api/v1/healthCheck",healthCheckRouter);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.data,
      errors: err.errors,
    });
  }

  // For unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message || "Unexpected error",
  });
});

export default app;