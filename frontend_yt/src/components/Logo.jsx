import React from "react";
import { IoIosShare, IoIosShareAlt, IoIosVideocam } from "react-icons/io";
import { Link } from "react-router-dom";

function Logo({ size = "30" }) {
    return (
        <>
            <Link to={'/'} className="flex gap-2 items-center">
                <IoIosVideocam
                    size={size}
                    color="#A855F7"
                />
                <span className="font-bold text-white flex"> 
                    <span>
                    Vibe-SHARE 

                    </span>
                    <IoIosShareAlt
                    size={13}
                    color="#A855F7"
                />
                </span>
                
                
            </Link>
        </>
    );
}

export default Logo;