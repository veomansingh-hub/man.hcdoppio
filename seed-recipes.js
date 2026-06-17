import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const initialMenuItems = [
  { id: 1, name: 'Expresso', category: 'Hot Beverages', price: 40, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }] },
  { id: 2, name: 'Americano', category: 'Hot Beverages', price: 50, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }] },
  { id: 3, name: 'Café Latte', category: 'Hot Beverages', price: 50, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }, { ingredientId: 2, quantity: 0.11 }, { ingredientId: 16, quantity: 10 }] },
  { id: 4, name: 'Doppio Hot Chocolate', category: 'Hot Beverages', price: 60, stock: 'In stock', available: true, recipe: [{ ingredientId: 18, quantity: 15 }, { ingredientId: 2, quantity: 0.135 }] },
  { id: 5, name: 'Café Mocha', category: 'Hot Beverages', price: 50, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }, { ingredientId: 3, quantity: 0.01 }, { ingredientId: 2, quantity: 0.11 }] },
  { id: 6, name: 'Iced Americano', category: 'Cold', price: 50, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }, { ingredientId: 17, quantity: 20 }] },
  { id: 7, name: 'Iced Latte', category: 'Cold', price: 50, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }, { ingredientId: 2, quantity: 0.1 }, { ingredientId: 16, quantity: 20 }, { ingredientId: 17, quantity: 5 }] },
  { id: 8, name: 'Classic Frappe', category: 'Cold', price: 60, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }, { ingredientId: 2, quantity: 0.07 }, { ingredientId: 11, quantity: 30 }, { ingredientId: 17, quantity: 20 }] },
  { id: 9, name: 'Mocha Frappe', category: 'Cold', price: 60, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }, { ingredientId: 2, quantity: 0.06 }, { ingredientId: 3, quantity: 0.015 }, { ingredientId: 11, quantity: 30 }, { ingredientId: 17, quantity: 15 }] },
  { id: 10, name: 'Irish Frappe', category: 'Cold', price: 60, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }, { ingredientId: 2, quantity: 0.07 }, { ingredientId: 19, quantity: 15 }, { ingredientId: 11, quantity: 30 }, { ingredientId: 17, quantity: 5 }] },
  { id: 11, name: 'Caramel Frappe', category: 'Cold', price: 60, stock: 'In stock', available: true, recipe: [{ ingredientId: 1, quantity: 15 }, { ingredientId: 2, quantity: 0.06 }, { ingredientId: 4, quantity: 0.015 }, { ingredientId: 11, quantity: 30 }, { ingredientId: 17, quantity: 15 }] },
  { id: 12, name: 'Cold Brew Ginger Ale', category: 'Cold Brew', price: 70, stock: 'In stock', available: true, recipe: [{ ingredientId: 12, quantity: 40 }, { ingredientId: 9, quantity: 1 }, { ingredientId: 17, quantity: 20 }, { ingredientId: 15, quantity: 5 }] },
  { id: 13, name: 'Cold Brew Tonic Water', category: 'Cold Brew', price: 70, stock: 'In stock', available: true, recipe: [{ ingredientId: 12, quantity: 50 }, { ingredientId: 13, quantity: 1 }, { ingredientId: 17, quantity: 20 }] },
  { id: 14, name: 'Spark It Up', category: 'Cold Brew', price: 70, stock: 'In stock', available: true, recipe: [{ ingredientId: 12, quantity: 40 }, { ingredientId: 14, quantity: 1 }, { ingredientId: 15, quantity: 10 }] },
  { id: 15, name: 'Cold Brew Watermelon', category: 'Cold Brew', price: 70, stock: 'In stock', available: true, recipe: [{ ingredientId: 12, quantity: 40 }] },
  { id: 16, name: 'Basil Cold Brew', category: 'Cold Brew', price: 70, stock: 'In stock', available: true, recipe: [{ ingredientId: 12, quantity: 40 }] },
  { id: 17, name: 'Butter Croissant', category: 'Food', price: 70, stock: 'In stock', available: true, recipe: [{ ingredientId: 10, quantity: 1 }] },
  { id: 18, name: 'Paneer Puff', category: 'Food', price: 45, stock: 'In stock', available: true, recipe: [{ ingredientId: 6, quantity: 1 }] },
  { id: 19, name: 'Aloo Puff', category: 'Food', price: 40, stock: 'In stock', available: true, recipe: [{ ingredientId: 7, quantity: 1 }] },
  { id: 20, name: 'Mini Samosas', category: 'Food', price: 40, stock: 'In stock', available: true, recipe: [] },
  { id: 21, name: 'Nachos with Dip', category: 'Food', price: 40, stock: 'In stock', available: true, recipe: [] },
  { id: 22, name: 'Diet Coke', category: 'Beverages', price: 40, stock: 'In stock', available: true, recipe: [{ ingredientId: 8, quantity: 1 }] },
  { id: 23, name: 'Lemon Soda', category: 'Beverages', price: 40, stock: 'In stock', available: true, recipe: [{ ingredientId: 14, quantity: 1 }, { ingredientId: 15, quantity: 10 }] },
  { id: 24, name: 'Water Bottle 500ml', category: 'Beverages', price: 10, stock: 'In stock', available: true, recipe: [] },
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
  { id: 11, ingredient: 'Vanilla Ice Cream', category: 'Dairy', inStock: '5000g', minLevel: '1000g', unitCost: '₹0.5', status: 'Optimal' },
  { id: 12, ingredient: 'Cold Brew Concentrate', category: 'Raw Material', inStock: '2000ml', minLevel: '500ml', unitCost: '₹1', status: 'Optimal' },
  { id: 13, ingredient: 'Indian Tonic Water', category: 'Beverages', inStock: '20', minLevel: '5', unitCost: '₹50', status: 'Optimal' },
  { id: 14, ingredient: 'Sprite/7Up', category: 'Beverages', inStock: '20', minLevel: '5', unitCost: '₹40', status: 'Optimal' },
  { id: 15, ingredient: 'Fresh Lime Juice', category: 'Raw Material', inStock: '500ml', minLevel: '100ml', unitCost: '₹0.5', status: 'Optimal' },
  { id: 16, ingredient: 'Simple Sugar Syrup', category: 'Flavoring', inStock: '1000ml', minLevel: '200ml', unitCost: '₹0.1', status: 'Optimal' },
  { id: 17, ingredient: 'Crushed Ice', category: 'Raw Material', inStock: '10000g', minLevel: '2000g', unitCost: '₹0.01', status: 'Optimal' },
  { id: 18, ingredient: 'Dark Chocolate Powder', category: 'Raw Material', inStock: '1000g', minLevel: '200g', unitCost: '₹1', status: 'Optimal' },
  { id: 19, ingredient: 'Irish Cream Syrup', category: 'Flavoring', inStock: '1000ml', minLevel: '200ml', unitCost: '₹0.5', status: 'Optimal' },
];

async function run() {
  console.log("Truncating menu_items...");
  await supabase.from('menu_items').delete().neq('id', 0);
  console.log("Truncating inventory...");
  await supabase.from('inventory').delete().neq('id', 0);
  
  console.log("Inserting menu items...");
  await supabase.from('menu_items').insert(initialMenuItems);
  console.log("Inserting inventory items...");
  await supabase.from('inventory').insert(initialInventory);
  console.log("Done!");
}

run();
