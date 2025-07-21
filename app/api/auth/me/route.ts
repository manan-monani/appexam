import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

// Fetches the authenticated user's profile from Supabase
// Reference: HackerRank Clone document, Section 4.2 (User Profile Management)

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch additional user data from the users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, name, role')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: userData.id,
    email: userData.email,
    name: userData.name,
    role: userData.role,
  });
}