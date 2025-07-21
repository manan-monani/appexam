import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { submissionSchema } from '@/schemas/submissionSchema';
import axios from 'axios';
import { submissionQueue } from '@/lib/api';

// POST: Submits code for execution via Judge0 and stores submission in Supabase
// Reference: HackerRank Clone document, Section 2.5 (Asynchronous Submission Pipeline)

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate submission data
  const body = await request.json();
  try {
    submissionSchema.parse(body);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid submission data' }, { status: 400 });
  }

  const { problemId, code, language } = body;

  // Verify problem exists
  const { data: problem, error: problemError } = await supabase
    .from('problems')
    .select('id')
    .eq('id', problemId)
    .single();

  if (problemError || !problem) {
    return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
  }

  // Store submission in Supabase
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .insert({
      user_id: user.id,
      problem_id: problemId,
      code,
      language,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (submissionError || !submission) {
    console.error('Submission insert error:', submissionError);
    return NextResponse.json({ error: 'Failed to store submission' }, { status: 500 });
  }

  // Queue submission for Judge0 processing
  try {
    await submissionQueue.add('process-submission', {
      submissionId: submission.id,
      problemId,
      code,
      language,
    });

    return NextResponse.json({ submissionId: submission.id }, { status: 202 });
  } catch (error) {
    console.error('Queue error:', error);
    return NextResponse.json({ error: 'Failed to queue submission' }, { status: 500 });
  }
}