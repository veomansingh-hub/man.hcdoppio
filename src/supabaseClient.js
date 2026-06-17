import { createClient } from '@supabase/supabase-js';

// The anon key is safe to expose in the frontend build
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nbrufzrwyrbiworkcyjy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FlVwEUdZW6iCQU7fm84boQ_KspFCD-K';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
