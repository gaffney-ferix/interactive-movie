import { useEffect, useRef, useState, useCallback } from 'react';
import type { BroadcastMessage } from '../types';

// PeerJS is loaded from a CDN script in index.html,
// so we need to declare its type for TypeScript.
declare const Peer: any;

interface PeerToPeerHookProps {
  onMessage: (message: BroadcastMessage) => void;
}

export const usePeerToPeerHost = ({ onMessage }: PeerToPeerHookProps) => {
  const [peer, setPeer] = useState<any>(null);
  const [hostId, setHostId] = useState<string | null>(null);
  const connectionsRef = useRef<any[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    // Wait for PeerJS to be loaded from the CDN
    const interval = setInterval(() => {
      if (typeof Peer !== 'undefined') {
        clearInterval(interval);
        
        const peerInstance = new Peer();
        setPeer(peerInstance);

        peerInstance.on('open', (id: string) => {
          if (isMounted.current) {
            setHostId(id);
          }
        });

        peerInstance.on('connection', (conn: any) => {
          conn.on('open', () => {
            connectionsRef.current.push(conn);
             if (isMounted.current) {
                setConnectionCount(prev => prev + 1);
             }
          });
          conn.on('data', (data: BroadcastMessage) => {
            onMessage(data);
          });
          conn.on('close', () => {
            connectionsRef.current = connectionsRef.current.filter(c => c.peer !== conn.peer);
            if (isMounted.current) {
                setConnectionCount(prev => prev - 1);
            }
          });
           conn.on('error', (err: any) => {
            console.error('PeerJS connection error:', err);
          });
        });

        peerInstance.on('error', (err: any) => {
            console.error('PeerJS main error:', err);
        });
      }
    }, 100);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
      connectionsRef.current.forEach(conn => conn.close());
      if (peer) {
        peer.destroy();
      }
    };
  }, [onMessage]);

  const postMessage = useCallback((message: BroadcastMessage) => {
    connectionsRef.current.forEach(conn => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }, []);

  return { isReady: !!hostId, hostId, connectionCount, postMessage };
};


export const usePeerToPeerClient = (hostId: string | undefined, { onMessage }: PeerToPeerHookProps) => {
    const [peer, setPeer] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const connRef = useRef<any>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        if (!hostId) return;

        const interval = setInterval(() => {
            if (typeof Peer !== 'undefined') {
                clearInterval(interval);
                const peerInstance = new Peer();
                setPeer(peerInstance);

                peerInstance.on('open', () => {
                    if (!isMounted.current) return;
                    const conn = peerInstance.connect(hostId);
                    connRef.current = conn;
                    conn.on('open', () => {
                        if (isMounted.current) {
                          setIsConnected(true);
                        }
                    });
                    conn.on('data', (data: BroadcastMessage) => {
                        onMessage(data);
                    });
                    conn.on('close', () => {
                         if (isMounted.current) {
                           setIsConnected(false);
                         }
                    });
                    conn.on('error', (err: any) => {
                        console.error('PeerJS connection error:', err);
                         if (isMounted.current) {
                           setIsConnected(false);
                         }
                    });
                });
                peerInstance.on('error', (err: any) => {
                    console.error('PeerJS main error:', err);
                    if (isMounted.current) {
                      setIsConnected(false);
                    }
                });
            }
        }, 100);

        return () => {
            isMounted.current = false;
            clearInterval(interval);
            if (connRef.current) {
              connRef.current.close();
            }
            if (peer) {
                peer.destroy();
            }
        };
    }, [hostId, onMessage]);

    const postMessage = useCallback((message: BroadcastMessage) => {
        if (connRef.current && connRef.current.open) {
            connRef.current.send(message);
        }
    }, []);

    return { isConnected, postMessage };
};
