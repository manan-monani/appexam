import { z } from 'zod';

// Zod schema for submission data validation
// Reference: HackerRank Clone document, Section 3.2 (Data Validation)

export const submissionSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
});