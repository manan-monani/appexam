import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

// POST: Generates a performance report for an exam (teacher/admin only)
// Reference: HackerRank Clone document, Section 4.3 (Reporting)

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
    return NextResponse.json({ error: 'Only teachers or admins can generate reports' }, { status: 403 });
  }

  // Extract examId from request body
  const { examId } = await request.json();
  if (!examId) {
    return NextResponse.json({ error: 'Missing examId' }, { status: 400 });
  }

  // Fetch exam details
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('id, title')
    .eq('id', examId)
    .single();

  if (examError || !exam) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  // Fetch submissions for the exam
  const { data: submissions, error: submissionError } = await supabase
    .from('submissions')
    .select('user_id, problem_id, status, result, created_at')
    .eq('exam_id', examId);

  if (submissionError) {
    console.error('Error fetching submissions:', submissionError);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }

  // Fetch user details
  const userIds = [...new Set(submissions.map(sub => sub.user_id))];
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name')
    .in('id', userIds);

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  // Generate report data
  const reportData = users.map(user => {
    const userSubmissions = submissions.filter(sub => sub.user_id === user.id);
    const totalScore = userSubmissions.reduce((sum, sub) => {
      return sub.status === 'accepted' && sub.result?.score ? sum + sub.result.score : sum;
    }, 0);

    return {
      userId: user.id,
      name: user.name,
      totalScore,
      submissions: userSubmissions.map(sub => ({
        problemId: sub.problem_id,
        status: sub.status,
        score: sub.result?.score || 0,
        submittedAt: sub.created_at,
      })),
    };
  });

  // Store report in Supabase
  const { error: reportError } = await supabase
    .from('reports')
    .insert({
      exam_id: examId,
      type: 'performance',
      data: { title: exam.title, users: reportData },
      created_at: new Date().toISOString(),
    });

  if (reportError) {
    console.error('Report insert error:', reportError);
    return NextResponse.json({ error: 'Failed to store report' }, { status: 500 });
  }

  return NextResponse.json({ report: { title: exam.title, users: reportData } }, { status: 200 });
}