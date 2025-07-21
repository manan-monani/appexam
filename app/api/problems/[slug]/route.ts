
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { userSchema } from '@/schemas/userSchema';

interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  published: boolean;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient();
  const { data: problem } = await supabase
    .from('problems')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!problem) {
    return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
  }

  return NextResponse.json(userSchema.parse(problem));
}
