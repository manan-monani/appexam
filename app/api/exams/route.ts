import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { userSchema } from '@/schemas/userSchema';

// GET: Lists exams with pagination, filtered by role (teacher, student, admin)
// Reference: HackerRank Clone document, Section 4.3 (RESTful API for Contests/Exams)

export async function GET(request: NextRequest) {
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

  // Extract pagination parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  // Fetch exams (students see only active/published, teachers/admins see all)
  const query = supabase
    .from('exams')
    .select('id, title, start_time, end_time, published', { count: 'exact' })
    .order('start_time', { ascending: false })
    .range(offset, offset + limit - 1);

  if (userData.role === 'student') {
    query.eq('published', true).gte('end_time', new Date().toISOString());
  }

  const { data: exams, count, error } = await query;

  if (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }

  return NextResponse.json({
    exams: exams || [],
    total: count || 0,
    page,
    limit,
  });
}