import React from "react";
import { Link } from "react-router-dom";
import { timeAgo,formatDuration } from "../helpers/timeAgo";
import { useNavigate } from 'react-router-dom';



function VideoVerticalList({
    videoId,
    thumbnail,
    title,
    duration,
    createdAt,
    views=0,
    avatar,
    channelName,
    description,
}) {
    const navigate = useNavigate();
    const handleAvatarClick = (e) => {
        e.stopPropagation();
        navigate(`/channel/${channelName}`);
    };
    return (
        <Link
            to={`/watch/${videoId}`}
            className="w-full flex gap-4 p-4 hover:bg-[#1a1a1a] transition rounded-md"
        >
            {/* Thumbnail */}
            <div className="relative min-w-[180px] h-[120px] sm:min-w-[240px] sm:h-[140px] overflow-hidden rounded-lg">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover rounded-lg"
                />
                <span className="absolute bottom-1 right-1 text-xs bg-black/80 px-1 rounded text-white">
                    {formatDuration(duration)}
                </span>
            </div>

            {/* Video Info */}
            <div className="flex flex-col justify-center w-full text-white">
                {/* Title */}
                <h3 className="font-semibold text-base sm:text-lg leading-snug line-clamp-2">
                    {title}
                </h3>

                {/* Meta info */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    {avatar && (
                        <div onClick={handleAvatarClick}>
                            <img
                                src={avatar}
                                className="w-10 h-10 rounded-full object-cover border border-slate-700"
                            />
                        </div>
                    )}
                    <span>{channelName}</span>
                </div>

                <div className="text-sm text-gray-500 mt-1">
                    {views} views • {timeAgo(createdAt)} ago
                </div>

                {/* Optional: Description preview */}
                {description && (
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                        {description}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default VideoVerticalList;
