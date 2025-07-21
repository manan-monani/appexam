// TypeScript types for submissions
// Reference: HackerRank Clone document, Section 3.2 (Data Models)

export interface Submission {
  id: string;
  problemId: string;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'rejected';
  result?: {
    score: number;
    passedTests: number;
    totalTests: number;
  };
  createdAt: string;
}