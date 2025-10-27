
import { useEffect, useRef, useCallback } from 'react';
import { BROADCAST_CHANNEL_NAME } from '../constants';
import type { BroadcastMessage } from '../types';

export const useBroadcastChannel = (onMessage: (message: BroadcastMessage) => void) => {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    
    const handleMessage = (event: MessageEvent<BroadcastMessage>) => {
      onMessage(event.data);
    };

    channelRef.current.addEventListener('message', handleMessage);

    return () => {
      if (channelRef.current) {
        channelRef.current.removeEventListener('message', handleMessage);
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, [onMessage]);

  const postMessage = useCallback((message: BroadcastMessage) => {
    if (channelRef.current) {
      channelRef.current.postMessage(message);
    }
  }, []);

  return { postMessage };
};
