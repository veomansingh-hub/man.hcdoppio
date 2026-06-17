import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const newSale = {
    id: Date.now(),
    orderNumber: "180626-1",
    date: new Date().toISOString(),
    total: 100,
    tax: 5,
    method: "Cash",
    items: []
  };
  const { data, error } = await supabase.from('sales').insert(newSale);
  console.log("Insert result:", {data, error});
}
test();
