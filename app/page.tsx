import Link from 'next/link';
import Button from '@/components/Button';

// Home page for the Secure Exam Code Platform
// Reference: HackerRank Clone document, Section 5.1 (Frontend Structure)

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Secure Exam Code</h1>
      <p className="text-lg mb-6">A platform for secure coding exams and assessments.</p>
      <Link href="/login">
        <Button variant="primary">Get Started</Button>
      </Link>
    </div>
  );
}