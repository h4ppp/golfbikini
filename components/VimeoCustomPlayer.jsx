"use client";
import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";

export default function VimeoCustomPlayer({ url, width = 640, height = 360 }) {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (iframeRef.current) {
      playerRef.current = new Player(iframeRef.current);

      playerRef.current.on("play", () => setIsPlaying(true));
      playerRef.current.on("pause", () => setIsPlaying(false));
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [url]);

  const handlePlay = () => {
    playerRef.current.play();
  };

  const handlePause = () => {
    playerRef.current.pause();
  };

  const handleFullscreen = () => {
    playerRef.current.requestFullscreen();
  };

  return (
    <div className="video-container">
      {/* Сам плеер без стандартных кнопок */}
      <iframe
        ref={iframeRef}
        src={`${url}?title=0&byline=0&portrait=0&controls=0`}
        width={width}
        height={height}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>

      {/* Кастомные кнопки */}
      <div className="controls">
        {!isPlaying ? (
          <button onClick={handlePlay}>▶ Пуск</button>
        ) : (
          <button onClick={handlePause}>⏸ Пауза</button>
        )}
        <button onClick={handleFullscreen}>⛶ Fullscreen</button>
      </div>

      <style jsx>{`
        .video-container {
          position: relative;
          width: 100%;
          max-width: ${width}px;
          margin: auto;
        }
        iframe {
          border-radius: 12px;
          width: 100%;
          height: ${height}px;
        }
        .controls {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 10px;
        }
        button {
          padding: 8px 16px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          background: #6c5ce7;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: #5a4bd6;
        }
      `}</style>
    </div>
  );
}
