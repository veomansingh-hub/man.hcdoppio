import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testSales() {
  const { data, error } = await supabase.from('sales').select('*');
  if (error) {
    console.error("Sales table error:", error.message);
  } else {
    console.log("Sales table exists! Data:", data);
  }
}
testSales();
