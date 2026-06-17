import React, { useContext, useState } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { Plus, Download, Upload, Check, X, Edit2 } from 'lucide-react';

const Inventory = () => {
  const { inventory, updateInventoryItem } = useContext(AppDataContext);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const saveEdit = () => {
    updateInventoryItem(editingId, editForm);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Control</h1>
          <p className="page-subtitle">Track stock, suppliers & low-stock alerts</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary"><Download size={16}/> Download Template</button>
          <button className="btn btn-secondary"><Upload size={16}/> Import CSV</button>
          <button className="btn btn-primary"><Plus size={16}/> Add Ingredient</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Category</th>
              <th>In Stock</th>
              <th>Min Level</th>
              <th>Unit Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                {editingId === item.id ? (
                  <>
                    <td><input className="form-input" value={editForm.ingredient} onChange={e => setEditForm({...editForm, ingredient: e.target.value})} /></td>
                    <td><input className="form-input" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} /></td>
                    <td><input className="form-input" value={editForm.inStock} onChange={e => setEditForm({...editForm, inStock: e.target.value})} style={{width: '80px'}} /></td>
                    <td><input className="form-input" value={editForm.minLevel} onChange={e => setEditForm({...editForm, minLevel: e.target.value})} style={{width: '80px'}} /></td>
                    <td><input className="form-input" value={editForm.unitCost} onChange={e => setEditForm({...editForm, unitCost: e.target.value})} style={{width: '80px'}} /></td>
                    <td>
                      <span className={`status-badge ${item.computedStatus === 'Optimal' ? 'optimal' : item.computedStatus === 'Critical' ? 'critical' : 'low'}`}>
                        {item.computedStatus} (Auto)
                      </span>
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
                    <td style={{ fontWeight: 500 }}>{item.ingredient}</td>
                    <td>{item.category}</td>
                    <td>{item.inStock}</td>
                    <td>{item.minLevel}</td>
                    <td>{item.unitCost}</td>
                    <td>
                      <span className={`status-badge ${item.computedStatus === 'Optimal' ? 'optimal' : item.computedStatus === 'Critical' ? 'critical' : 'low'}`}>
                        {item.computedStatus}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => startEdit(item)}><Edit2 size={16}/></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Inventory;
