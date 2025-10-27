
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBroadcastChannel } from '../hooks/useBroadcastChannel';
import { MessageType } from '../types';
import type { SendStampPayload, BroadcastMessage } from '../types';
import { VIDEO_URL, VIDEO_TITLE } from '../constants';
import Stamp from '../components/Stamp';

interface DisplayStamp extends SendStampPayload {
  id: number;
  top: string;
}

const AdminPage: React.FC = () => {
  const [stampsOnScreen, setStampsOnScreen] = useState<DisplayStamp[]>([]);
  const [showStamps, setShowStamps] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stampQueueRef = useRef<SendStampPayload[]>([]);
  const animationFrameRef = useRef<number>();

  const handleMessage = useCallback((message: BroadcastMessage) => {
    if (message.type === MessageType.SEND_STAMP) {
      stampQueueRef.current.push(message);
    }
  }, []);

  const { postMessage } = useBroadcastChannel(handleMessage);

  const broadcastVideoState = useCallback(() => {
    if (videoRef.current) {
      postMessage({
        type: MessageType.VIDEO_STATE,
        currentTime: videoRef.current.currentTime,
        isPlaying: !videoRef.current.paused,
        videoSrc: VIDEO_URL,
        videoTitle: VIDEO_TITLE,
      });
    }
  }, [postMessage]);

  const animationLoop = useCallback(() => {
    if (videoRef.current && showStamps) {
      const currentTime = videoRef.current.currentTime;
      const dueStamps = stampQueueRef.current.filter(
        (stamp) => stamp.timestamp <= currentTime && stamp.timestamp > currentTime - 5
      );

      if (dueStamps.length > 0) {
        stampQueueRef.current = stampQueueRef.current.filter(
          (stamp) => !dueStamps.includes(stamp)
        );
        
        const newStampsToDisplay: DisplayStamp[] = dueStamps.map((stamp) => ({
          ...stamp,
          id: Date.now() + Math.random(),
          top: `${Math.random() * 85}%`, // 0-85% to avoid controls
        }));

        setStampsOnScreen((prev) => [...prev, ...newStampsToDisplay]);

        newStampsToDisplay.forEach(stamp => {
            setTimeout(() => {
                setStampsOnScreen(prev => prev.filter(s => s.id !== stamp.id));
            }, 3000); // Remove after 3s animation
        });
      }
    }
    animationFrameRef.current = requestAnimationFrame(animationLoop);
  }, [showStamps]);
  
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animationLoop);
    return () => {
        if(animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
  }, [animationLoop]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
       <div className="w-full max-w-4xl">
        <div className="relative aspect-video bg-black shadow-2xl">
          <video
            ref={videoRef}
            src={VIDEO_URL}
            controls
            className="w-full h-full"
            onPlay={broadcastVideoState}
            onPause={broadcastVideoState}
            onTimeUpdate={broadcastVideoState}
          />
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {stampsOnScreen.map(({ id, stamp, top }) => (
              <Stamp key={id} stamp={stamp} top={top} />
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 p-4 bg-gray-800 rounded-lg">
          <div>
            <h1 className="text-xl font-bold">{VIDEO_TITLE}</h1>
            <p className="text-sm text-gray-400">Admin Player View</p>
          </div>
          <div className="flex items-center gap-4">
             <label className="flex items-center cursor-pointer">
              <span className="mr-3 text-lg font-medium">Show Stamps</span>
              <div className="relative">
                <input type="checkbox" checked={showStamps} onChange={() => setShowStamps(!showStamps)} className="sr-only" />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${showStamps ? 'transform translate-x-6 bg-blue-400' : ''}`}></div>
              </div>
            </label>
            <Link to="/" className="text-gray-300 hover:text-white">&larr; Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
