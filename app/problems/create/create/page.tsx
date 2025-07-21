
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import ReactMarkdown from 'react-markdown';

interface TestCase {
  input: string;
  expected_output: string;
  is_sample: boolean;
}

interface ProblemFormData {
  title: string;
  slug: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  published: boolean;
  testCases: TestCase[];
}

export default function CreateProblemPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<ProblemFormData>({
    title: '',
    slug: '',
    description: '',
    difficulty: 'easy',
    published: false,
    testCases: [{ input: '', expected_output: '', is_sample: false }],
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !['teacher', 'admin'].includes(user.role))) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    const { data: problemData } = await supabase
      .from('problems')
      .insert({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        difficulty: formData.difficulty,
        published: formData.published,
      })
      .select('id')
      .single();

    if (!problemData) {
      setError('Failed to create problem');
      return;
    }

    const testCases = formData.testCases.map((tc) => ({
      problem_id: problemData.id,
      input: tc.input,
      expected_output: tc.expected_output,
      is_sample: tc.is_sample,
    }));

    const { error: testCaseError } = await supabase.from('test_cases').insert(testCases);

    if (testCaseError) {
      setError('Failed to create test cases');
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/dashboard/teacher'), 2000);
  };

  const handleTestCaseChange = (index: number, field: string, value: string | boolean) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setFormData({ ...formData, testCases: newTestCases });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', expected_output: '', is_sample: false }],
    });
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Create New Problem</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description (Markdown)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 min-h-[200px]"
            required
          />
          <div className="mt-2 p-4 border rounded-md bg-white dark:bg-gray-800">
            <ReactMarkdown>{formData.description}</ReactMarkdown>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) =>
              setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })
            }
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Published</label>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="h-4 w-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Test Cases</label>
          {formData.testCases.map((tc, index) => (
            <div key={index} className="space-y-2 mb-4 p-4 border rounded-md">
              <div>
                <label className="block text-sm">Input</label>
                <textarea
                  value={tc.input}
                  onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm">Expected Output</label>
                <textarea
                  value={tc.expected_output}
                  onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm">Sample Test Case</label>
                <input
                  type="checkbox"
                  checked={tc.is_sample}
                  onChange={(e) => handleTestCaseChange(index, 'is_sample', e.target.checked)}
                  className="h-4 w-4"
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addTestCase}>
            Add Test Case
          </Button>
        </div>
        <Button type="submit" variant="primary">
          Create Problem
        </Button>
      </form>
      <Modal isOpen={success} onClose={() => setSuccess(false)}>
        <p>Problem created successfully!</p>
      </Modal>
    </div>
  );
}
