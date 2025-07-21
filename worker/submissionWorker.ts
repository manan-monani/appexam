
import { Worker } from 'bullmq';
import axios from 'axios';
import { createClient } from '@/lib/supabaseClient';
import { Server } from 'socket.io';

interface JobData {
  submissionId: string;
  problemId: string;
  code: string;
  language: string;
  examId: string;
}

interface TestCase {
  id: string;
  input: string;
  expected_output: string;
}

interface Judge0Result {
  status: { id: number; description: string };
  test_cases: any[]; // Temporarily any; refine later
}

// Initialize Socket.IO server for worker
const io = new Server({ path: '/api/socket' });

// Worker for processing code submissions with Judge0
new Worker(
  'submission-queue',
  async (job: { data: JobData }) => {
    const { submissionId, problemId, code, language, examId } = job.data;

    const supabase = createClient();

    // Fetch problem test cases
    const { data: problem } = await supabase
      .from('problems')
      .select('test_cases(id, input, expected_output)')
      .eq('id', problemId)
      .single();

    if (!problem) {
      await supabase
        .from('submissions')
        .update({ status: 'rejected', result: { error: 'Problem not found' } })
        .eq('id', submissionId);
      io.emit('submissionResult', { submissionId, status: 'rejected' });
      return;
    }

    // Submit to Judge0
    const judge0Response = await axios.post(`${process.env.JUDGE0_URL}/submissions`, {
      source_code: code,
      language_id: language === 'javascript' ? 63 : 71,
      test_cases: problem.test_cases,
    });

    if (!judge0Response.data.token) {
      await supabase
        .from('submissions')
        .update({ status: 'rejected', result: { error: 'Judge0 submission failed' } })
        .eq('id', submissionId);
      io.emit('submissionResult', { submissionId, status: 'rejected' });
      return;
    }

    // Poll Judge0 for results
    const result = await pollJudge0Result(judge0Response.data.token);

    // Update submission in Supabase
    await supabase
      .from('submissions')
      .update({
        status: result.status === 'accepted' ? 'accepted' : 'rejected',
        result: {
          score: result.score,
          passedTests: result.passedTests,
          totalTests: result.totalTests,
        },
      })
      .eq('id', submissionId);

    // Emit submission result and trigger leaderboard update
    io.emit('submissionResult', { submissionId, status: result.status });
    io.emit('submissionUpdate', examId);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  }
);

async function pollJudge0Result(token: string) {
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await axios.get(`${process.env.JUDGE0_URL}/submissions/${token}`);
    if (response.data.status.id <= 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
      continue;
    }

    return {
      status: response.data.status.description.toLowerCase(),
      score: calculateScore(response.data),
      passedTests: response.data.test_cases.filter((tc: any) => tc.status.id === 3).length,
      totalTests: response.data.test_cases.length,
    };
  }

  return { status: 'rejected', score: 0, passedTests: 0, totalTests: 0 };
}

function calculateScore(result: any): number {
  return result.test_cases.filter((tc: any) => tc.status.id === 3).length * 10;
}
