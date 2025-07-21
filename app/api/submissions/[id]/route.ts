import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { userSchema } from '@/schemas/userSchema';

interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  exam_id: string;
  status: string;
  result: any; // Temporarily left as any; refine later
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: submission } = await supabase
    .from('submissions')
    .select('*, users(name)')
    .eq('id', params.id)
    .single();

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }

  return NextResponse.json(userSchema.parse(submission));