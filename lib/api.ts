import { Queue } from 'bullmq';

// Initializes BullMQ queue for asynchronous submission processing
// Reference: HackerRank Clone document, Section 2.5 (Asynchronous Submission Pipeline)

export const submissionQueue = new Queue('submission-queue', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});