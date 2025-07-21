import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { userSchema } from '@/schemas/userSchema';

// GET: Fetches details of a specific exam, including associated problems
// Reference: HackerRank Clone document, Section 4.3 (Contest/Exam Management)

export async function GET(request: NextRequest, { params }: { params: { examId: string } }) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate user role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    userSchema.parse({ role: userData.role });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid user role' }, { status: 400 });
  }

  // Fetch exam details
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('id, title, start_time, end_time, published, created_by')
    .eq('id', params.examId)
    .single();

  if (examError || !exam) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  // Restrict unpublished exams to teachers/admins
  if (!exam.published && userData.role === 'student') {
    return NextResponse.json({ error: 'Exam not accessible' }, { status: 403 });
  }

  // Fetch associated problems
  const { data: examProblems, error: problemError } = await supabase
    .from('exam_problems')
    .select('problem:problems(id, slug, title, difficulty, published)')
    .eq('exam_id', params.examId);

  if (problemError) {
    console.error('Error fetching exam problems:', problemError);
    return NextResponse.json({ error: 'Failed to fetch exam problems' }, { status: 500 });
  }

  // Filter problems for students (only published)
  const problems = examProblems
    .map((ep: any) => ep.problem)
    .filter((p: any) => userData.role !== 'student' || p.published);

  return NextResponse.json({
    id: exam.id,
    title: exam.title,
    startTime: exam.start_time,
    endTime: exam.end_time,
    published: exam.published,
    createdBy: exam.created_by,
    problems,
  });
}