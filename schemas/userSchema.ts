import { z } from 'zod';

// Zod schema for user data validation
// Reference: HackerRank Clone document, Section 3.2 (Data Validation)

export const userSchema = z.object({
  role: z.enum(['student', 'teacher', 'admin']),
});