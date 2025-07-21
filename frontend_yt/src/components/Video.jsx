
import React, { useState } from "react";

import { Loader2 } from "lucide-react"; // Optional: icon for spinner

// function Video({ src, poster }) {
//     const [loading, setLoading] = useState(true);

//     return (
//         <div className="flex flex-col ml-20 mt-10">
//             <div className="relative w-full sm:max-w-4xl rounded-2xl overflow-hidden border border-slate-600 shadow-xl bg-black">
//                 {loading && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
//                         <Loader2 className="animate-spin text-white w-8 h-8" />
//                     </div>
//                 )}
//                 <video
//                     src={src}
//                     poster={poster}
//                     autoPlay
//                     controls
//                     playsInline
//                     onCanPlay={() => setLoading(false)}
//                     className="w-full h-64 sm:h-[68vh] object-contain"
//                 />
//             </div>
//             {/* <p className="mt-4 text-white text-xl font-semibold">Now Playing</p> */}
//         </div>
//     );
// }


function Video({ src, poster }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-center sm:items-start w-full mt-10 px-3 sm:px-20">
      <div className="relative w-full sm:max-w-4xl rounded-2xl overflow-hidden border border-slate-600 shadow-xl bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
            <Loader2 className="animate-spin text-white w-8 h-8" />
          </div>
        )}
        <video
          src={src}
          poster={poster}
          autoPlay
          controls
          playsInline
          onCanPlay={() => setLoading(false)}
          className="w-full h-64 sm:h-[68vh] object-contain"
        />
      </div>
    </div>
  );
}

export default Video;

