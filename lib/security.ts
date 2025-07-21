import { logAction } from '@/utils/logger';

// Browser lockdown functions for secure exam environment
// Reference: HackerRank Clone document, Section 5.3 (Secure Exam Environment)

export function lockBrowser() {
  // Request full-screen mode
  document.documentElement.requestFullscreen().catch(err => {
    logAction(`Fullscreen error: ${err.message}`);
  });

  // Prevent navigation
  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave the exam?';
  });

  // Disable copy/paste
  const blockCopyPaste = (e: Event) => {
    e.preventDefault();
    logAction('Copy/paste attempted during exam');
  };
  document.addEventListener('copy', blockCopyPaste);
  document.addEventListener('paste', blockCopyPaste);
}