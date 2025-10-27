
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBroadcastChannel } from '../hooks/useBroadcastChannel';
import { MessageType } from '../types';
import type { VideoStatePayload, BroadcastMessage } from '../types';
import { STAMPS } from '../constants';

const UserPage: React.FC = () => {
  const [videoState, setVideoState] = useState<VideoStatePayload | null>(null);

  const handleMessage = useCallback((message: BroadcastMessage) => {
    if (message.type === MessageType.VIDEO_STATE) {
      setVideoState(message);
    }
  }, []);

  const { postMessage } = useBroadcastChannel(handleMessage);

  const sendStamp = (stamp: string) => {
    if (videoState) {
      postMessage({
        type: MessageType.SEND_STAMP,
        stamp: stamp,
        timestamp: videoState.currentTime,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Stamp Sender</h1>
          <p className="text-gray-400">Tap a stamp to send it to the video!</p>
        </div>
        
        {videoState ? (
          <div className="bg-gray-700 p-4 rounded-lg mb-6 text-center">
            <h2 className="text-lg font-semibold truncate">{videoState.videoTitle}</h2>
            <p className="text-3xl font-mono my-2">{formatTime(videoState.currentTime)}</p>
            <span className={`px-3 py-1 text-sm font-bold rounded-full ${videoState.isPlaying ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-900'}`}>
              {videoState.isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>
        ) : (
          <div className="bg-gray-700 p-4 rounded-lg mb-6 text-center">
             <h2 className="text-lg font-semibold">Waiting for video...</h2>
             <p className="text-gray-400">Please start playback in the Admin view.</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {STAMPS.map((stamp) => (
            <button
              key={stamp}
              onClick={() => sendStamp(stamp)}
              disabled={!videoState?.isPlaying}
              className="aspect-square text-4xl bg-gray-700 rounded-lg flex items-center justify-center transition-transform transform hover:scale-110 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {stamp}
            </button>
          ))}
        </div>
        <div className="text-center mt-6">
           <Link to="/" className="text-gray-400 hover:text-white">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
