import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';

// Hook for managing in-app notifications
// Reference: HackerRank Clone document, Section 5.3 (Exam UI)

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socket = useSocket();

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = uuidv4();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('submissionResult', (data: { submissionId: string; status: string }) => {
      addNotification(
        `Submission ${data.submissionId} ${data.status}`,
        data.status === 'accepted' ? 'success' : 'error'
      );
    });

    socket.on('examEvent', (data: { message: string }) => {
      addNotification(data.message, 'success');
    });

    return () => {
      socket.off('submissionResult');
      socket.off('examEvent');
    };
  }, [socket]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
}