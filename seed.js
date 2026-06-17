import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  const { data, error } = await supabase.from('menu_items').insert([{ id: 1, name: 'Test', category: 'Test', price: 10, stock: 'In stock', available: true }]);
  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Insert success!");
    // cleanup
    await supabase.from('menu_items').delete().eq('id', 1);
  }
}
testInsert();
