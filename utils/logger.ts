import { createClient } from '@/lib/supabaseClient';

// Logging utility for security events (e.g., browser lockdown violations)
// Reference: HackerRank Clone document, Section 5.3 (Secure Exam Environment)

export async function logAction(message: string) {
  console.log(`[Security Log] ${message}`);

  const supabase = createClient();
  const { error } = await supabase.from('security_logs').insert({
    message,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error logging action:', error);
  }
}