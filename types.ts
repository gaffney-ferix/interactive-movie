
export enum MessageType {
  VIDEO_STATE = 'VIDEO_STATE',
  SEND_STAMP = 'SEND_STAMP',
}

export interface VideoStatePayload {
  type: MessageType.VIDEO_STATE;
  currentTime: number;
  isPlaying: boolean;
  videoSrc: string;
  videoTitle: string;
}

export interface SendStampPayload {
  type: MessageType.SEND_STAMP;
  stamp: string;
  timestamp: number;
}

export type BroadcastMessage = VideoStatePayload | SendStampPayload;
