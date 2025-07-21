'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useExam } from '@/features/exams/hooks/useExam';
import CodeEditor from '@/components/CodeEditor';
import Timer from '@/components/Timer';
import TestCasePanel from '@/components/TestCasePanel';
import ProblemDescription from '@/components/ProblemDescription';
import Button from '@/components/Button';
import { createClient } from '@/lib/supabaseClient';

// Exam page with CodeMirror editor, timer, and test cases
// Reference: HackerRank Clone document, Section 5.3 (Secure Coding Environment)

export default function ExamPage({ params }: { params: { examId: string } }) {
  const { user, loading: authLoading } = useAuth();
  const { exam, problems, loading: examLoading, error } = useExam(params.examId);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (problems && problems.length > 0) {
      setSelectedProblem(problems[0]);
      setCode(''); // Reset code when changing problems
    }
  }, [problems]);

  const handleSubmit = async () => {
    if (!selectedProblem || !code) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        user_id: user!.id,
        exam_id: params.examId,
        problem_id: selectedProblem.id,
        code,
        language: 'javascript', // Default language, adjust as needed
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Submission error:', error);
      return;
    }

    router.push(`/exams/${params.examId}/submit?submissionId=${data.id}`);
  };

  if (authLoading || examLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !exam) {
    return <div className="flex justify-center items-center min-h-screen">Error: {error || 'Exam not found'}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div>
        <Timer endTime={exam.endTime} />
        <h2 className="text-xl font-semibold mb-2">Problems</h2>
        <ul className="space-y-2 mb-4">
          {problems.map((problem: any) => (
            <li key={problem.id}>
              <Button
                variant={selectedProblem?.id === problem.id ? 'primary' : 'secondary'}
                onClick={() => {
                  setSelectedProblem(problem);
                  setCode('');
                }}
                className="w-full text-left"
              >
                {problem.title}
              </Button>
            </li>
          ))}
        </ul>
        {selectedProblem && <ProblemDescription description={selectedProblem.description} />}
      </div>
      <div>
        {selectedProblem && (
          <>
            <CodeEditor
              value={code}
              onChange={setCode}
              language="javascript" // Adjust based on problem
            />
            <Button variant="primary" onClick={handleSubmit} className="mt-4">
              Submit Code
            </Button>
            <TestCasePanel testCases={selectedProblem.testCases} />
          </>
        )}
      </div>
    </div>
  );
}