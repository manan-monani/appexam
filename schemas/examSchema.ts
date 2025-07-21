import { z } from 'zod';

// Zod schema for exam data validation
// Reference: HackerRank Clone document, Section 3.2 (Data Validation)

export const examSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  start_time: z.string().datetime({ message: 'Invalid start time' }),
  end_time: z.string().datetime({ message: 'Invalid end time' }),
  published: z.boolean(),
  problemIds: z.array(z.string()).min(1, 'At least one problem is required'),
});