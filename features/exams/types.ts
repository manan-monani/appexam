// TypeScript types for exams
// Reference: HackerRank Clone document, Section 3.2 (Data Models)

export interface Exam {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  published: boolean;
  createdBy: string;
}