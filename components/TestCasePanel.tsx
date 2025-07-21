'use client';

import { TestCase } from '@/features/problems/types';

// Displays test case results for a problem
// Reference: HackerRank Clone document, Section 5.3 (Test Case Feedback)

interface TestCasePanelProps {
  testCases: TestCase[];
}

export default function TestCasePanel({ testCases }: TestCasePanelProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Test Cases</h3>
      {testCases.length === 0 ? (
        <p>No test cases available.</p>
      ) : (
        <ul className="space-y-2">
          {testCases.map((tc, index) => (
            <li key={tc.id} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
              <p><strong>Test Case {index + 1}:</strong></p>
              <p>Input: {tc.input}</p>
              <p>Expected Output: {tc.is_sample ? tc.expected_output : 'Hidden'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}