'use client';

import { SubmissionHistory } from '@/components/SubmissionHistory';

// Student page for viewing submission history
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function SubmissionHistoryPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Submission History</h1>
      <SubmissionHistory />
    </div>
  );
}