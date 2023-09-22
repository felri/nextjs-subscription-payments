import { getStorageSupabaseUrl, getStorageSupabaseUrlThumbnail } from "@/utils/helpers";
import React from "react";

const VideoPlayer = ({
  mediaUrl,
  userId
}: {
  mediaUrl: string;
  userId: string;
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden cursor-pointer min-h-[360px]">
      <video
        muted
        ref={videoRef}
        preload="none"
        width="100%"
        height="auto"
        className="rounded-md"
        poster={getStorageSupabaseUrlThumbnail(mediaUrl, userId)}
        controls
        src={getStorageSupabaseUrl(mediaUrl, userId)}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;