'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

// Real-time leaderboard component for exams
// Reference: HackerRank Clone document, Section 7.1 (Real-time Features)

interface LeaderboardProps {
  examId: string;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
}

export default function Leaderboard({ examId }: LeaderboardProps) {
  const socket = useSocket();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinExam', examId);

    socket.on('leaderboardUpdate', (data: LeaderboardEntry[]) => {
      setLeaderboard(data.sort((a, b) => b.score - a.score));
    });

    return () => {
      socket.emit('leaveExam', examId);
      socket.off('leaderboardUpdate');
    };
  }, [socket, examId]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No rankings available.</p>
      ) : (
        <ul className="space-y-2">
          {leaderboard.map((entry, index) => (
            <li
              key={entry.userId}
              className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
            >
              <span>
                {index + 1}. {entry.name}
              </span>
              <span>{entry.score} points</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}