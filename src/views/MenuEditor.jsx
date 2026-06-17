import React, { useContext, useState } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { Plus, Download, Upload, Edit2, Trash2, Check, X, FileText } from 'lucide-react';

const MenuEditor = () => {
  const { menuItems, inventory, addMenuItem, toggleItemAvailability, deleteMenuItem, updateMenuItem } = useContext(AppDataContext);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Food' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  // Recipe Modal State
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [recipeItem, setRecipeItem] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState([]);

  const categories = ['Hot Beverages', 'Cold', 'Cold Brew', 'Food', 'Beverages'];

  const handleSave = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    addMenuItem({
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category,
      recipe: []
    });
    setNewItem({ name: '', price: '', category: 'Food' });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const saveEdit = () => {
    updateMenuItem(editingId, { ...editForm, price: parseFloat(editForm.price) });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Recipe Management
  const openRecipeModal = (item) => {
    setRecipeItem(item);
    setCurrentRecipe(item.recipe || []);
    setRecipeModalOpen(true);
  };

  const addRecipeIngredient = () => {
    if (inventory.length === 0) return;
    setCurrentRecipe([...currentRecipe, { ingredientId: inventory[0].id, quantity: 1 }]);
  };

  const updateRecipeIngredient = (index, field, value) => {
    const updated = [...currentRecipe];
    updated[index] = { ...updated[index], [field]: field === 'ingredientId' ? Number(value) : Number(value) };
    setCurrentRecipe(updated);
  };

  const removeRecipeIngredient = (index) => {
    setCurrentRecipe(currentRecipe.filter((_, i) => i !== index));
  };

  const saveRecipe = () => {
    updateMenuItem(recipeItem.id, { recipe: currentRecipe });
    setRecipeModalOpen(false);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Editor</h1>
          <p className="page-subtitle">Add, edit & manage recipes for live inventory deduction</p>
        </div>
      </div>

      <div className="menu-editor-layout">
        {/* Add Item Form */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '20px' }}>Add new item</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Item name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Paneer Tikka"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="199"
                  value={newItem.price}
                  onChange={e => setNewItem({...newItem, price: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-input"
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              Save item
            </button>
          </form>
        </div>

        {/* Menu Items List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Menu items</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary"><Download size={14}/> Download Template</button>
              <button className="btn btn-secondary"><Upload size={14}/> Import CSV</button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Recipe</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id}>
                    {editingId === item.id ? (
                      <>
                        <td><input className="form-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                        <td>
                          <select className="form-input" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </td>
                        <td><input type="number" className="form-input" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} style={{width: '80px'}} /></td>
                        <td><button className="btn btn-secondary" style={{padding: '4px 8px'}} onClick={() => openRecipeModal(item)}>Edit Recipe</button></td>
                        <td>
                          <label className="toggle-switch">
                            <input 
                              type="checkbox" 
                              checked={editForm.available} 
                              onChange={e => setEditForm({...editForm, available: e.target.checked})}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="action-btn" onClick={saveEdit} style={{ color: 'var(--success)' }}><Check size={16}/></button>
                            <button className="action-btn" onClick={cancelEdit} style={{ color: '#d32f2f' }}><X size={16}/></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ fontWeight: 500 }}>{item.name}</td>
                        <td>{item.category}</td>
                        <td>₹{item.price}</td>
                        <td>
                          <button className="btn btn-secondary" style={{padding: '4px 8px'}} onClick={() => openRecipeModal(item)}>
                            {item.recipe && item.recipe.length > 0 ? `${item.recipe.length} Ingredients` : 'Add Recipe'}
                          </button>
                        </td>
                        <td>
                          <label className="toggle-switch">
                            <input 
                              type="checkbox" 
                              checked={item.available} 
                              onChange={() => toggleItemAvailability(item.id)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="action-btn" onClick={() => startEdit(item)}><Edit2 size={16}/></button>
                            <button className="action-btn" onClick={() => deleteMenuItem(item.id)}>
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recipe Modal */}
      {recipeModalOpen && recipeItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Recipe for {recipeItem.name}</h3>
              <button className="action-btn" onClick={() => setRecipeModalOpen(false)}><X size={20}/></button>
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              These quantities will be automatically deducted from Inventory every time this item is sold.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {currentRecipe.map((ri, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select 
                    className="form-input" 
                    style={{ flex: 1 }}
                    value={ri.ingredientId} 
                    onChange={e => updateRecipeIngredient(index, 'ingredientId', e.target.value)}
                  >
                    {inventory.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.ingredient} ({String(inv.inStock).replace(/[\d.]/g, '').trim() || 'units'})</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ width: '100px' }} 
                    value={ri.quantity} 
                    onChange={e => updateRecipeIngredient(index, 'quantity', e.target.value)}
                    step="0.01"
                  />
                  <button className="action-btn" onClick={() => removeRecipeIngredient(index)} style={{ color: '#d32f2f' }}>
                    <Trash2 size={18}/>
                  </button>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary" onClick={addRecipeIngredient} style={{ width: '100%', marginBottom: '20px' }}>
              <Plus size={16}/> Add Ingredient
            </button>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setRecipeModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveRecipe}>Save Recipe</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuEditor;
