import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import path from 'path';

// POST: Triggers MOSS plagiarism detection for exam submissions
// Reference: HackerRank Clone document, Section 7.3 (Plagiarism Detection)

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Restrict to teachers/admins
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError || !userData || !['teacher', 'admin'].includes(userData.role)) {
    return NextResponse.json({ error: 'Only teachers or admins can check plagiarism' }, { status: 403 });
  }

  // Extract examId from request body
  const { examId } = await request.json();
  if (!examId) {
    return NextResponse.json({ error: 'Missing examId' }, { status: 400 });
  }

  // Fetch submissions for the exam
  const { data: submissions, error: submissionError } = await supabase
    .from('submissions')
    .select('id, user_id, code, language')
    .eq('exam_id', examId);

  if (submissionError || !submissions) {
    console.error('Error fetching submissions:', submissionError);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }

  // Prepare files for MOSS
  const mossDir = path.join(process.cwd(), 'moss_temp');
  try {
    await Promise.all(
      submissions.map(async (sub, index) => {
        const filePath = path.join(mossDir, `submission_${sub.user_id}_${index}.${sub.language}`);
        await writeFile(filePath, sub.code);
      })
    );

    // Run MOSS script (assuming MOSS is configured locally or via script)
    const mossCommand = `perl ${path.join(process.cwd(), 'scripts', 'plagiarismCheck.ts')} -l ${submissions[0]?.language || 'python'} ${mossDir}/*`;
    const { stdout, stderr } = await execPromise(mossCommand);

    if (stderr) {
      console.error('MOSS error:', stderr);
      return NextResponse.json({ error: 'Plagiarism check failed' }, { status: 500 });
    }

    // Store plagiarism report URL in Supabase
    const { error: reportError } = await supabase
      .from('reports')
      .insert({
        exam_id: examId,
        type: 'plagiarism',
        data: { moss_url: stdout.trim() },
        created_at: new Date().toISOString(),
      });

    if (reportError) {
      console.error('Report insert error:', reportError);
      return NextResponse.json({ error: 'Failed to store plagiarism report' }, { status: 500 });
    }

    return NextResponse.json({ reportUrl: stdout.trim() }, { status: 200 });
  } catch (error) {
    console.error('Plagiarism check error:', error);
    return NextResponse.json({ error: 'Plagiarism check failed' }, { status: 500 });
  }
}