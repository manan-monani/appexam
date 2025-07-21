import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

// Handles Google OAuth callback, exchanges code for session, and updates user in Supabase
// Reference: HackerRank Clone document, Section 4.2 (Authentication with Google OAuth)

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=missing_code`);
  }

  // Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=auth_failed`);
  }

  // Update or create user in Supabase
  const { user } = data;
  const { error: upsertError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
      role: user.user_metadata.role || 'student', // Default to student if role not set
      updated_at: new Date().toISOString(),
    });

  if (upsertError) {
    console.error('User upsert error:', upsertError);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=user_update_failed`);
  }

  // Redirect to dashboard based on role
  const role = user.user_metadata.role || 'student';
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${role.toLowerCase()}`);
}