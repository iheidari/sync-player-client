"use client";

import { useState, useRef } from "react";

interface VideoPlayerProps {
  initialUrl?: string;
}

export default function VideoPlayer({ initialUrl = "" }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoad = () => {
    if (videoUrl.trim()) {
      setCurrentUrl(videoUrl);
      // Reset video to beginning when changing URL
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.load();
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLoad();
    }
  };

  return (
    <div className="video-player-container">
      <div className="video-controls">
        <div className="url-input-group">
          <input
            type="text"
            value={videoUrl}
            onChange={handleUrlChange}
            onKeyDown={handleKeyPress}
            placeholder="Enter video URL..."
            className="url-input"
          />
          <button
            onClick={handleLoad}
            className="play-button"
            disabled={!videoUrl.trim()}
          >
            Load
          </button>
        </div>
      </div>

      <div className="video-container">
        {currentUrl ? (
          <video
            ref={videoRef}
            controls
            className="video-player"
            style={{ width: "100%", maxWidth: "800px" }}
          >
            <source src={currentUrl} type="video/mp4" />
            <source src={currentUrl} type="video/webm" />
            <source src={currentUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="video-placeholder">
            <p>Enter a video URL and click Load to start</p>
          </div>
        )}
      </div>
    </div>
  );
}
