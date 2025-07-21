'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import Button from '@/components/Button';

// Login page with Google OAuth
// Reference: HackerRank Clone document, Section 4.2 (Authentication)

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (!loading && user) {
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login to Secure Exam Code</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <a href="/api/auth/google">
        <Button variant="primary">Sign in with Google</Button>
      </a>
    </div>
  );
}