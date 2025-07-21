
import { Server, Socket } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/lib/supabaseClient';

interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if ((res.socket as any).server.io) {
    res.end();
    return;
  }

  const io = new Server((res.socket as any).server, {
    path: '/api/socket',
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinExam', async (examId: string) => {
      socket.join(examId);
      await updateLeaderboard(io, examId);
    });

    socket.on('leaveExam', (examId: string) => {
      socket.leave(examId);
    });

    socket.on('submissionUpdate', async (examId: string) => {
      await updateLeaderboard(io, examId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  (res.socket as any).server.io = io;
  res.end();
}

async function updateLeaderboard(io: Server, examId: string) {
  const supabase = createClient();
  const { data: submissions } = await supabase
    .from('submissions')
    .select('user_id, result, users(name)')
    .eq('exam_id', examId)
    .not('result', 'is', null);

  const leaderboard: LeaderboardEntry[] = Object.values(
    submissions?.reduce((acc: { [key: string]: LeaderboardEntry }, sub: any) => {
      const userId = sub.user_id;
      const score = sub.result?.score || 0;
      if (!acc[userId]) {
        acc[userId] = { userId, name: sub.users.name, score: 0 };
      }
      acc[userId].score += score;
      return acc;
    }, {}) || {}
  ).sort((a, b) => b.score - a.score);

  io.to(examId).emit('leaderboardUpdate', leaderboard);
}
