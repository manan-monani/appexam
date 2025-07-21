import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

// Initiates Google OAuth flow by redirecting to Google's auth URL
// Reference: HackerRank Clone document, Section 4.2 (Authentication with Google OAuth)

export async function GET(request: NextRequest) {
  const supabase = createClient();
  
  // Generate Google OAuth URL
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.error('OAuth initiation error:', error);
    return NextResponse.json({ error: 'Failed to initiate Google OAuth' }, { status: 500 });
  }

  // Redirect to Google's authentication page
  return NextResponse.redirect(data.url);
}