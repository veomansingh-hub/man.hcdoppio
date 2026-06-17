import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const initialMenuItems = [
  { id: 1, name: 'Expresso', category: 'Hot Beverages', price: 40, stock: 'In stock', available: true },
  { id: 2, name: 'Americano', category: 'Hot Beverages', price: 50, stock: 'In stock', available: true },
  { id: 3, name: 'Café Latte', category: 'Hot Beverages', price: 50, stock: 'In stock', available: true },
  { id: 4, name: 'Doppio Hot Chocolate', category: 'Hot Beverages', price: 60, stock: 'In stock', available: true },
  { id: 5, name: 'Café Mocha', category: 'Hot Beverages', price: 50, stock: 'In stock', available: true },
  { id: 6, name: 'Iced Americano', category: 'Cold', price: 50, stock: 'In stock', available: true },
  { id: 7, name: 'Iced Latte', category: 'Cold', price: 50, stock: 'In stock', available: true },
  { id: 8, name: 'Classic Frappe', category: 'Cold', price: 60, stock: 'In stock', available: true },
  { id: 9, name: 'Mocha Frappe', category: 'Cold', price: 60, stock: 'In stock', available: true },
  { id: 10, name: 'Irish Frappe', category: 'Cold', price: 60, stock: 'In stock', available: true },
  { id: 11, name: 'Caramel Frappe', category: 'Cold', price: 60, stock: 'In stock', available: true },
  { id: 12, name: 'Cold Brew Ginger Ale', category: 'Cold Brew', price: 70, stock: 'In stock', available: true },
  { id: 13, name: 'Cold Brew Tonic Water', category: 'Cold Brew', price: 70, stock: 'In stock', available: true },
  { id: 14, name: 'Spark It Up', category: 'Cold Brew', price: 70, stock: 'In stock', available: true },
  { id: 15, name: 'Cold Brew Watermelon', category: 'Cold Brew', price: 70, stock: 'In stock', available: true },
  { id: 16, name: 'Basil Cold Brew', category: 'Cold Brew', price: 70, stock: 'In stock', available: true },
  { id: 17, name: 'Butter Croissant', category: 'Food', price: 70, stock: 'In stock', available: true },
  { id: 18, name: 'Paneer Puff', category: 'Food', price: 45, stock: 'In stock', available: true },
  { id: 19, name: 'Aloo Puff', category: 'Food', price: 40, stock: 'In stock', available: true },
  { id: 20, name: 'Mini Samosas', category: 'Food', price: 40, stock: 'In stock', available: true },
  { id: 21, name: 'Nachos with Dip', category: 'Food', price: 40, stock: 'In stock', available: true },
  { id: 22, name: 'Diet Coke', category: 'Beverages', price: 40, stock: 'In stock', available: true },
  { id: 23, name: 'Lemon Soda', category: 'Beverages', price: 40, stock: 'In stock', available: true },
  { id: 24, name: 'Water Bottle 500ml', category: 'Beverages', price: 10, stock: 'In stock', available: true },
];

const initialInventory = [
  { id: 1, ingredient: 'Coffee Beans', category: 'Raw Material', inStock: '5000g', minLevel: '1000g', unitCost: '₹2', status: 'Optimal' },
  { id: 2, ingredient: 'Milk', category: 'Dairy', inStock: '20L', minLevel: '5L', unitCost: '₹60', status: 'Optimal' },
  { id: 3, ingredient: 'Chocolate Syrup', category: 'Flavoring', inStock: '2L', minLevel: '0.5L', unitCost: '₹300', status: 'Optimal' },
  { id: 4, ingredient: 'Caramel Syrup', category: 'Flavoring', inStock: '1L', minLevel: '0.5L', unitCost: '₹300', status: 'Optimal' },
  { id: 5, ingredient: 'Ice Cups', category: 'Packaging', inStock: '200', minLevel: '50', unitCost: '₹5', status: 'Optimal' },
  { id: 6, ingredient: 'Paneer Puff (Raw)', category: 'Food', inStock: '20', minLevel: '10', unitCost: '₹20', status: 'Optimal' },
  { id: 7, ingredient: 'Aloo Puff (Raw)', category: 'Food', inStock: '30', minLevel: '10', unitCost: '₹15', status: 'Optimal' },
  { id: 8, ingredient: 'Diet Coke Cans', category: 'Beverages', inStock: '50', minLevel: '20', unitCost: '₹30', status: 'Optimal' },
  { id: 9, ingredient: 'Ginger Ale', category: 'Beverages', inStock: '20', minLevel: '10', unitCost: '₹40', status: 'Optimal' },
  { id: 10, ingredient: 'Croissants', category: 'Food', inStock: '5', minLevel: '10', unitCost: '₹35', status: 'Low Stock' },
];

async function seed() {
  console.log("Seeding menu_items...");
  const { error: err1 } = await supabase.from('menu_items').insert(initialMenuItems);
  if (err1) console.error("Error seeding menu:", err1);
  else console.log("Menu seeded!");

  console.log("Seeding inventory...");
  const { error: err2 } = await supabase.from('inventory').insert(initialInventory);
  if (err2) console.error("Error seeding inventory:", err2);
  else console.log("Inventory seeded!");
}
seed();
