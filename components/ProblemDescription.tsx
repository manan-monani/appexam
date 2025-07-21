'use client';

import ReactMarkdown from 'react-markdown';

// Displays problem description in Markdown format
// Reference: HackerRank Clone document, Section 5.3 (Problem UI)

interface ProblemDescriptionProps {
  description: string;
}

export default function ProblemDescription({ description }: ProblemDescriptionProps) {
  return (
    <div className="prose dark:prose-invert max-w-none p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
  );
}