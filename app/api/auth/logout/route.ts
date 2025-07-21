import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

// Logs out the user by destroying the Supabase session
// Reference: HackerRank Clone document, Section 4.2 (Authentication)

export async function POST() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }

  // Redirect to login page after logout
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
}