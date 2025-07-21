'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Teacher analytics dashboard for exam performance
// Reference: HackerRank Clone document, Section 5.3 (Reporting)

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'teacher')) {
      return;
    }

    const fetchExams = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('exams')
        .select('id, title')
        .eq('created_by', user!.id);

      if (error) {
        setError('Failed to fetch exams');
      } else {
        setExams(data || []);
        if (data.length > 0) {
          setSelectedExam(data[0].id);
        }
      }
      setFetchingData(false);
    };

    fetchExams();
  }, [authLoading, user]);

  useEffect(() => {
    if (!selectedExam) return;

    const fetchAnalytics = async () => {
      const supabase = createClient();
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('user_id, result, users(name)')
        .eq('exam_id', selectedExam)
        .not('result', 'is', null);

      if (error) {
        setError('Failed to fetch analytics');
        return;
      }

      const userScores = submissions?.reduce((acc: any, sub: any) => {
        const userId = sub.user_id;
        if (!acc[userId]) {
          acc[userId] = { name: sub.users.name, score: 0, count: 0 };
        }
        acc[userId].score += sub.result?.score || 0;
        acc[userId].count += 1;
        return acc;
      }, {});

      const chart = {
        labels: Object.values(userScores || {}).map((u: any) => u.name),
        datasets: [
          {
            label: 'Total Score',
            data: Object.values(userScores || {}).map((u: any) => u.score),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
          {
            label: 'Submissions',
            data: Object.values(userScores || {}).map((u: any) => u.count),
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
          },
        ],
      };

      setChartData(chart);
    };

    fetchAnalytics();
  }, [selectedExam]);

  if (authLoading || fetchingData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Exam Analytics</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {exams.length === 0 ? (
        <p>No exams found.</p>
      ) : (
        <>
          <select
            value={selectedExam || ''}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full p-2 border rounded-md mb-4 dark:bg-gray-700 dark:border-gray-600"
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
          {chartData ? (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Exam Performance' },
                  },
                }}
              />
            </div>
          ) : (
            <p>No analytics data available.</p>
          )}
        </>
      )}
    </div>
  );
}