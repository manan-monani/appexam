import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Hook for Socket.IO real-time communication
// Reference: HackerRank Clone document, Section 7.1 (Real-time Features)

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}