import React from "react";
import { useNavigate } from "react-router-dom";

function Avatar({ src, channelName,width=32,height=32 }) {
    const navigate = useNavigate();

    const handleAvatarClick = (e) => {
        e.stopPropagation()
        navigate(`/channel/${channelName}`);
    };
    return (
        <>
            <img
                src={src}
                alt="avatar"
                className="rounded-full object-cover cursor-pointer"
                style={{ width: `${width}px`, height: `${height}px` }}
                onClick={handleAvatarClick}
            />
        </>
    );
}

export default Avatar;