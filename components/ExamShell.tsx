'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { lockBrowser } from '@/lib/security';
import { logAction } from '@/utils/logger';

// Full-screen exam wrapper with browser lockdown features
// Reference: HackerRank Clone document, Section 5.3 (Secure Exam Environment)

interface ExamShellProps {
  children: React.ReactNode;
}

export default function ExamShell({ children }: ExamShellProps) {
  const router = useRouter();

  useEffect(() => {
    // Enable browser lockdown
    lockBrowser();

    // Log suspicious actions (e.g., tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logAction('Tab switch detected during exam');
      }
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      logAction('Right-click attempted during exam');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault();
        logAction(`Keyboard shortcut blocked: ${e.key}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 overflow-auto">
      {children}
    </div>
  );
}