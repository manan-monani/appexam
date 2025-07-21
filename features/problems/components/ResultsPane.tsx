'use client';

import { Submission } from '@/features/submissions/types';

// Displays submission results for a problem
// Reference: HackerRank Clone document, Section 5.3 (Submission Feedback)

interface ResultsPaneProps {
  submission: Submission | null;
}

export default function ResultsPane({ submission }: ResultsPaneProps) {
  if (!submission || submission.status === 'pending') {
    return <div className="p-4">No results available.</div>;
  }

  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
      <h3 className="text-lg font-medium mb-2">Submission Results</h3>
      <p><strong>Status:</strong> {submission.status}</p>
      {submission.result && (
        <>
          <p><strong>Score:</strong> {submission.result.score || 0}</p>
          <p><strong>Passed Tests:</strong> {submission.result.passedTests}/{submission.result.totalTests}</p>
        </>
      )}
    </div>
  );
}