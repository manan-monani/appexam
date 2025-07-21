import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { Redis } from '@upstash/redis';

// GET: Fetches the real-time leaderboard for an exam using Redis Sorted Sets
// Reference: HackerRank Clone document, Section 7.1 (Real-time Leaderboard)

export async function GET(request: NextRequest, { params }: { params: { examId: string } }) {
  const supabase = createClient();
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify exam exists
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('id, published')
    .eq('id', params.examId)
    .single();

  if (examError || !exam) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  // Check user role for access
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!exam.published && userData.role === 'student') {
    return NextResponse.json({ error: 'Exam not accessible' }, { status: 403 });
  }

  // Fetch leaderboard from Redis
  const leaderboardKey = `leaderboard:exam:${params.examId}`;
  const leaderboard = await redis.zrange(leaderboardKey, 0, -1, { withScores: true });

  // Fetch user details for leaderboard entries
  const userIds = leaderboard.filter((_, index) => index % 2 === 0);
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name')
    .in('id', userIds);

  if (usersError) {
    console.error('Error fetching users for leaderboard:', usersError);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }

  // Map leaderboard data
  const rankings = leaderboard.reduce((acc, val, index, arr) => {
    if (index % 2 === 0) {
      const user = users.find(u => u.id === val);
      acc.push({
        userId: val,
        name: user?.name || 'Unknown',
        score: arr[index + 1] || 0,
      });
    }
    return acc;
  }, [] as { userId: string; name: string; score: number }[]);

  return NextResponse.json({ rankings });
}