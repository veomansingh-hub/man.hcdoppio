import React, { useContext, useState } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { Plus, Download, Upload, Edit2, Trash2, Check, X } from 'lucide-react';

const MenuEditor = () => {
  const { menuItems, addMenuItem, toggleItemAvailability, deleteMenuItem, updateMenuItem } = useContext(AppDataContext);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Food' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const categories = ['Hot Beverages', 'Cold', 'Cold Brew', 'Food', 'Beverages'];

  const handleSave = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    addMenuItem({
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category
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

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Editor</h1>
          <p className="page-subtitle">Add, edit & cost your menu items</p>
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
                  <th>Stock</th>
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
                        <td><input className="form-input" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: e.target.value})} style={{width: '100px'}} /></td>
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
                        <td><span className="status-badge optimal">{item.stock}</span></td>
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
    </>
  );
};

export default MenuEditor;
