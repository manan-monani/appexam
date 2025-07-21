
'use client';

import { useAuth } from '@/features/authentication/hooks/useAuth';
import Link from 'next/link';

export default function Navbar() {
  const { user, loading, setUser } = useAuth();

  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabaseClient');
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return <nav className="bg-gray-800 text-white p-4">Loading...</nav>;
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Secure Exam Code
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              {user.role === 'teacher' && (
                <Link href="/problems/create" className="hover:underline">
                  Create Problem
                </Link>
              )}
              <button onClick={handleSignOut} className="hover:underline">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
