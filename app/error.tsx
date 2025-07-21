
// Custom error page for handling 404, 500, and other errors
// Displays user-friendly error messages and a link to return home
// Reference: HackerRank Clone document, Section 5 (Frontend Implementation)

'use client';

import Link from 'next/link';
import Button from '@/components/Button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-lg mb-8 text-center max-w-md">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-4">
        <Button variant="primary" onClick={() => reset()}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="secondary">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
}