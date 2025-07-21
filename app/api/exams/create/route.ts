import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { examSchema } from '@/schemas/examSchema';

// POST: Allows teachers to create a new exam
// Reference: HackerRank Clone document, Section 4.3 (Contest/Exam Management)

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify user is a teacher
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError || !userData || userData.role !== 'teacher') {
    return NextResponse.json({ error: 'Only teachers can create exams' }, { status: 403 });
  }

  // Validate exam data
  const body = await request.json();
  try {
    examSchema.parse(body);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid exam data' }, { status: 400 });
  }

  const { title, start_time, end_time, published, problemIds } = body;

  // Verify problems exist
  const { data: problems, error: problemError } = await supabase
    .from('problems')
    .select('id')
    .in('id', problemIds);

  if (problemError || !problems || problems.length !== problemIds.length) {
    return NextResponse.json({ error: 'Invalid problem IDs' }, { status: 400 });
  }

  // Create exam
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert({
      title,
      start_time: new Date(start_time).toISOString(),
      end_time: new Date(end_time).toISOString(),
      published,
      created_by: user.id,
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (examError || !exam) {
    console.error('Exam creation error:', examError);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }

  // Associate problems with exam
  const examProblems = problemIds.map((problemId: string) => ({
    exam_id: exam.id,
    problem_id: problemId,
  }));

  const { error: examProblemError } = await supabase
    .from('exam_problems')
    .insert(examProblems);

  if (examProblemError) {
    console.error('Exam problems association error:', examProblemError);
    return NextResponse.json({ error: 'Failed to associate problems' }, { status: 500 });
  }

  return NextResponse.json({ examId: exam.id }, { status: 201 });
}