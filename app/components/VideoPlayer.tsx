"use client";

import { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  initialUrl?: string;
  onSendMessage: (message: string) => void;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export default function VideoPlayer({
  initialUrl = "",
  onSendMessage,
  videoUrl,
  onVideoUrlChange,
  videoRef,
}: VideoPlayerProps) {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Update currentUrl when videoUrl prop changes
  useEffect(() => {
    if (videoUrl) {
      setCurrentUrl(videoUrl);
      // Update the textbox value to match the new videoUrl
      if (urlInputRef.current) {
        urlInputRef.current.value = videoUrl;
      }
      // Reset video to beginning when changing URL
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.load();
      }
    }
  }, [videoUrl, currentUrl]);

  const handleLoad = (url: string) => {
    if (url.trim()) {
      onVideoUrlChange(url);
      onSendMessage("/load " + url);
    }
  };

  const handleVideoPlay = () => {
    // Send "/play" message to chat when video starts playing
    if (videoRef.current) {
      onSendMessage(
        "/play " + Math.round(videoRef.current.currentTime * 100) / 100
      );
    }
  };

  const handleVideoPause = () => {
    // Send "/pause" message to chat when video is paused
    onSendMessage("/pause");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = urlInputRef.current?.value || "";
    handleLoad(url);
  };

  return (
    <div className="video-player-container">
      <div className="video-controls">
        <form onSubmit={handleSubmit} className="url-input-group">
          <input
            ref={urlInputRef}
            type="text"
            placeholder="Enter video URL..."
            className="url-input"
          />
          <button type="submit" className="play-button">
            Load
          </button>
        </form>
      </div>

      <div className="video-container">
        {currentUrl ? (
          <video
            ref={videoRef}
            controls
            className="video-player"
            style={{ width: "100%", maxWidth: "800px" }}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
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
