// TypeScript types for problems and test cases
// Reference: HackerRank Clone document, Section 3.2 (Data Models)

export interface Problem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  published: boolean;
  testCases: TestCase[];
}

export interface TestCase {
  id: string;
  input: string;
  expected_output: string;
  is_sample: boolean;
}