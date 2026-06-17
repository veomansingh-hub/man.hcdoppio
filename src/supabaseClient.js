import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// IMPORTANT: The user must replace these with their actual Supabase Project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// We only export the client if the URL is somewhat valid (not the placeholder)
export const supabase = (supabaseUrl !== 'YOUR_SUPABASE_URL') 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
