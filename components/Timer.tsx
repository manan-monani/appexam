'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatTime } from '@/utils/formatTime';

// Exam countdown timer component
// Reference: HackerRank Clone document, Section 5.3 (Exam UI)

interface TimerProps {
  endTime: string;
}

export default function Timer({ endTime }: TimerProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const end = new Date(endTime).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft('Exam Ended');
        router.push('/dashboard/student');
        return;
      }

      setTimeLeft(formatTime(distance));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, router]);

  return (
    <div className="text-lg font-medium bg-blue-100 dark:bg-blue-900 p-2 rounded-md mb-4">
      Time Left: {timeLeft}
    </div>
  );
}