import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://afygifqzaywmlfxnpzak.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeWdpZnF6YXl3bWxmeG5wemFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTk5ODEsImV4cCI6MjEwMzgzNTk4MX0.ngVcI7o5QpuHr2p-5iqkXDBIJiCTp7UTgQnKqwdT4VM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
