import Link from 'next/link';
import Button from '@/components/Button';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

// Student dashboard page showing available exams and submission history
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchExams = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('exams')
        .select('id, title, start_time, end_time')
        .eq('published', true)
        .gte('end_time', new Date().toISOString());

      if (error) {
        console.error('Error fetching exams:', error);
      } else {
        setExams(data || []);
      }
      setLoading(false);
    };

    fetchExams();
  }, [user]);

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'student') {
    return null; // Layout handles redirection
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
      <h3 className="text-lg font-medium">Available Exams</h3>
      {exams.length === 0 ? (
        <p>No active exams available.</p>
      ) : (
        <ul className="space-y-2">
          {exams.map(exam => (
            <li key={exam.id}>
              <Link href={`/exams/${exam.id}`}>
                <Button variant="primary" className="w-full text-left">
                  {exam.title} (Ends: {new Date(exam.end_time).toLocaleString()})
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link href="/dashboard/student/submissions">
        <Button variant="secondary">View Submission History</Button>
      </Link>
    </div>
  );
}