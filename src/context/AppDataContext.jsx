import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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

export const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [inventory, setInventory] = useState(initialInventory);
  const [sales, setSales] = useState([]); 
  const [userRole, setUserRole] = useState(null); 
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Offline-first sync logic
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncQueueToSupabase();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load from localStorage
    const localMenu = localStorage.getItem('menuItems');
    if (localMenu) setMenuItems(JSON.parse(localMenu));
    
    const localInv = localStorage.getItem('inventory');
    if (localInv) setInventory(JSON.parse(localInv));
    
    const localSales = localStorage.getItem('sales');
    if (localSales) setSales(JSON.parse(localSales));

    // Try to fetch from Supabase and sync queue
    fetchFromSupabase();
    syncQueueToSupabase();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save to localStorage on change
  useEffect(() => { localStorage.setItem('menuItems', JSON.stringify(menuItems)); }, [menuItems]);
  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('sales', JSON.stringify(sales)); }, [sales]);

  const executeAction = async (action) => {
    if (!supabase) return;
    try {
      if (action.type === 'INSERT') {
        await supabase.from(action.table).insert(action.payload);
      } else if (action.type === 'UPDATE') {
        await supabase.from(action.table).update(action.payload).eq('id', action.payload.id);
      } else if (action.type === 'DELETE') {
        await supabase.from(action.table).delete().eq('id', action.payload.id);
      } else if (action.type === 'TRUNCATE') {
        await supabase.from(action.table).delete().neq('id', 0); // Effectively truncate
      }
    } catch (e) {
      console.error('Supabase Sync Error:', e);
    }
  };

  const syncQueueToSupabase = async () => {
    if (!supabase) return;
    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    if (queue.length === 0) return;

    for (const action of queue) {
      await executeAction(action);
    }
    localStorage.setItem('syncQueue', '[]');
  };

  const addToSyncQueue = (action) => {
    if (isOnline && supabase) {
      executeAction(action);
    } else {
      const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
      queue.push(action);
      localStorage.setItem('syncQueue', JSON.stringify(queue));
    }
  };

  const fetchFromSupabase = async () => {
    if (!supabase) return;
    try {
      const { data: mData } = await supabase.from('menu_items').select('*');
      if (mData && mData.length > 0) setMenuItems(mData);

      const { data: iData } = await supabase.from('inventory').select('*');
      if (iData && iData.length > 0) setInventory(iData);

      const { data: sData } = await supabase.from('sales').select('*');
      if (sData && sData.length > 0) setSales(sData);
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (pin) => {
    if (pin === '2629') {
      setUserRole('cashier');
      await fetchFromSupabase();
      return true;
    } else if (pin === '2593') {
      setUserRole('manager');
      await fetchFromSupabase();
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserRole(null);
  };

  const addSale = (orderTotal, taxCollected, paymentMethod, items) => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const datePrefix = `${dd}${mm}${yy}`;

    const todayOrders = sales.filter(s => s.orderNumber && s.orderNumber.startsWith(datePrefix));
    const orderIndex = todayOrders.length + 1;
    const orderNumber = `${datePrefix}-${orderIndex}`;

    const newSale = {
      id: Date.now(),
      orderNumber,
      date: now,
      total: orderTotal,
      tax: taxCollected,
      method: paymentMethod,
      items: items
    };
    
    // Live Inventory Deduction
    const updatedInventoryList = [...inventory];
    let inventoryChanged = false;

    items.forEach(soldItem => {
      // Find the menu item to get its recipe
      const menuItem = menuItems.find(m => m.id === soldItem.id);
      if (menuItem && menuItem.recipe && menuItem.recipe.length > 0) {
        menuItem.recipe.forEach(recipeIngredient => {
          // Find the corresponding inventory item
          const invItemIndex = updatedInventoryList.findIndex(inv => inv.id === recipeIngredient.ingredientId);
          if (invItemIndex !== -1) {
            const invItem = updatedInventoryList[invItemIndex];
            
            // Extract numeric value and unit
            const currentStockNum = parseFloat(String(invItem.inStock).replace(/[^\d.]/g, '')) || 0;
            const unit = String(invItem.inStock).replace(/[\d.]/g, '').trim();
            
            // Calculate deduction
            const deductionAmount = parseFloat(recipeIngredient.quantity) * soldItem.quantity;
            const newStockNum = Math.max(0, currentStockNum - deductionAmount);
            
            // Create updated inventory item
            const updatedInvItem = { 
              ...invItem, 
              inStock: `${newStockNum}${unit}` 
            };
            
            updatedInventoryList[invItemIndex] = updatedInvItem;
            inventoryChanged = true;
            
            // Sync inventory update to Supabase
            addToSyncQueue({ table: 'inventory', type: 'UPDATE', payload: updatedInvItem });
          }
        });
      }
    });

    if (inventoryChanged) {
      setInventory(updatedInventoryList);
    }

    setSales([...sales, newSale]);
    addToSyncQueue({ table: 'sales', type: 'INSERT', payload: newSale });
    return orderNumber;
  };

  const addMenuItem = (item) => {
    const newItem = { ...item, id: Date.now(), stock: 'In stock', available: true };
    setMenuItems([...menuItems, newItem]);
    addToSyncQueue({ table: 'menu_items', type: 'INSERT', payload: newItem });
  };

  const toggleItemAvailability = (id) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    const updated = { ...item, available: !item.available };
    setMenuItems(menuItems.map(i => i.id === id ? updated : i));
    addToSyncQueue({ table: 'menu_items', type: 'UPDATE', payload: updated });
  };

  const deleteMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    addToSyncQueue({ table: 'menu_items', type: 'DELETE', payload: { id } });
  };

  const updateMenuItem = (id, updatedData) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    const updated = { ...item, ...updatedData };
    setMenuItems(menuItems.map(i => i.id === id ? updated : i));
    addToSyncQueue({ table: 'menu_items', type: 'UPDATE', payload: updated });
  };

  const updateInventoryItem = (id, updates) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    addToSyncQueue({ table: 'inventory', type: 'UPDATE', payload: { id, ...updates } });
  };

  const addInventoryItem = (item) => {
    const newItem = { id: Date.now() + Math.random(), ...item };
    setInventory(prev => [...prev, newItem]);
    addToSyncQueue({ table: 'inventory', type: 'INSERT', payload: newItem });
  };

  const resetSystem = (pin) => {
    if (pin === '2593') {
      setMenuItems(initialMenuItems);
      setInventory(initialInventory);
      setSales([]);
      addToSyncQueue({ table: 'menu_items', type: 'TRUNCATE' });
      addToSyncQueue({ table: 'inventory', type: 'TRUNCATE' });
      addToSyncQueue({ table: 'sales', type: 'TRUNCATE' });
      return true;
    }
    return false;
  };

  const getComputedStatus = (inStockStr, minLevelStr) => {
    const stock = parseFloat(String(inStockStr).replace(/[^\d.]/g, '')) || 0;
    const min = parseFloat(String(minLevelStr).replace(/[^\d.]/g, '')) || 0;
    if (stock <= min * 0.5) return 'Critical';
    if (stock <= min * 1.2) return 'Low Stock';
    return 'Optimal';
  };

  const enhancedInventory = inventory.map(item => ({
    ...item,
    computedStatus: getComputedStatus(item.inStock, item.minLevel)
  }));

  return (
    <AppDataContext.Provider value={{
      menuItems,
      inventory: enhancedInventory,
      sales,
      userRole,
      isOnline,
      login,
      logout,
      addSale,
      addMenuItem,
      toggleItemAvailability,
      deleteMenuItem,
      updateMenuItem,
      updateInventoryItem,
      addInventoryItem,
      setInventory,
      setMenuItems,
      resetSystem
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
