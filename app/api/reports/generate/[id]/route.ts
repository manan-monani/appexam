import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { userSchema } from '@/schemas/userSchema';

// GET: Fetches details of a specific report
// Reference: HackerRank Clone document, Section 4.3 (RESTful API for Reports)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

  if (!['admin', 'teacher'].includes(userData.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Fetch report
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('id, type, data, exam:exams(id, title, created_by)')
    .eq('id', params.id)
    .single();

  if (reportError || !report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Restrict teacher access to their own exams
  if (userData.role === 'teacher' && report.exam.created_by !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  return NextResponse.json({
    id: report.id,
    type: report.type,
    data: report.data,
    exam: { id: report.exam.id, title: report.exam.title },
  });
}