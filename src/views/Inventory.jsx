import React, { useContext, useState, useRef } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { Plus, Download, Upload, Check, X, Edit2, PackagePlus, Trash2 } from 'lucide-react';
import { importFromCSV, exportToExcel } from '../utils/exportUtils';

const Inventory = () => {
  const { inventory, updateInventoryItem, addInventoryItem, deleteInventoryItem } = useContext(AppDataContext);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [receivingId, setReceivingId] = useState(null);
  const [receiveAmount, setReceiveAmount] = useState('');
  const fileInputRef = useRef(null);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
    setReceivingId(null);
  };

  const saveEdit = () => {
    updateInventoryItem(editingId, editForm);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const startReceive = (item) => {
    setReceivingId(item.id);
    setReceiveAmount('');
    setEditingId(null);
  };

  const saveReceive = (item) => {
    if (!receiveAmount || isNaN(parseFloat(receiveAmount))) {
      setReceivingId(null);
      return;
    }
    
    const currentNum = parseFloat(String(item.inStock).replace(/[^\d.]/g, '')) || 0;
    const unit = String(item.inStock).replace(/[\d.]/g, '').trim();
    const addedNum = parseFloat(receiveAmount);
    const newTotal = currentNum + addedNum;
    
    updateInventoryItem(item.id, { inStock: `${newTotal}${unit}` });
    setReceivingId(null);
  };

  const cancelReceive = () => {
    setReceivingId(null);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await importFromCSV(file);
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item.ingredient) addInventoryItem({
            ingredient: item.ingredient,
            inStock: item.inStock || '0',
            maxCapacity: item.maxCapacity || '100'
          });
        });
        alert('Inventory imported successfully!');
      }
    } catch (err) {
      alert('Error importing file');
    }
    e.target.value = null;
  };

  const handleDownloadTemplate = () => {
    const template = [{
      ingredient: "New Ingredient", inStock: "0g", maxCapacity: "5000g"
    }];
    exportToExcel(template, "doppio_inventory_template");
  };

  // Battery Bar Component
  const BatteryBar = ({ percentage }) => {
    let color = '#4caf50'; // Green
    if (percentage <= 20) color = '#f44336'; // Red
    else if (percentage <= 50) color = '#ff9800'; // Orange

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px' }}>
        <div style={{ flex: 1, height: '12px', background: '#e0e0e0', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ccc' }}>
          <div style={{ width: `${percentage}%`, height: '100%', background: color, transition: 'width 0.3s ease' }}></div>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', width: '35px' }}>
          {Math.round(percentage)}%
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Control</h1>
          <p className="page-subtitle">Track stock, setup max capacities, and view live deductions</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleImport}
          />
          <button className="btn btn-secondary" onClick={handleDownloadTemplate}><Download size={16}/> Download Template</button>
          <button className="btn btn-secondary" onClick={() => exportToExcel(inventory, 'doppio_inventory_export')}><Download size={16}/> Export Inventory</button>
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}><Upload size={16}/> Import CSV</button>
          <button className="btn btn-primary" onClick={() => addInventoryItem({ ingredient: 'New Item', inStock: '0g', maxCapacity: '100g' })}><Plus size={16}/> Add Ingredient</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Current Stock</th>
              <th>Par Level (Total Stock)</th>
              <th>Health</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                {editingId === item.id ? (
                  <>
                    <td><input className="form-input" value={editForm.ingredient} onChange={e => setEditForm({...editForm, ingredient: e.target.value})} /></td>
                    <td><input className="form-input" value={editForm.inStock} onChange={e => setEditForm({...editForm, inStock: e.target.value})} style={{width: '100px'}} /></td>
                    <td><input className="form-input" value={editForm.maxCapacity || editForm.inStock} onChange={e => setEditForm({...editForm, maxCapacity: e.target.value})} style={{width: '100px'}} /></td>
                    <td><BatteryBar percentage={item.statusInfo?.percentage || 0} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-btn" onClick={saveEdit} style={{ color: 'var(--success)' }}><Check size={16}/></button>
                        <button className="action-btn" onClick={cancelEdit} style={{ color: '#d32f2f' }}><X size={16}/></button>
                      </div>
                    </td>
                  </>
                ) : receivingId === item.id ? (
                  <>
                    <td style={{ fontWeight: 500 }}>{item.ingredient}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{item.inStock} + </span>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={receiveAmount} 
                          onChange={e => setReceiveAmount(e.target.value)} 
                          style={{width: '70px', padding: '4px'}} 
                          placeholder="Amount"
                          autoFocus
                        />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{String(item.inStock).replace(/[\d.]/g, '').trim()}</span>
                      </div>
                    </td>
                    <td>{item.maxCapacity || item.inStock}</td>
                    <td><BatteryBar percentage={item.statusInfo?.percentage || 0} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-btn" onClick={() => saveReceive(item)} style={{ color: 'var(--success)' }}><Check size={16}/></button>
                        <button className="action-btn" onClick={cancelReceive} style={{ color: '#d32f2f' }}><X size={16}/></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ fontWeight: 500 }}>{item.ingredient}</td>
                    <td style={{ fontWeight: 'bold' }}>{item.inStock}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.maxCapacity || item.inStock}</td>
                    <td><BatteryBar percentage={item.statusInfo?.percentage || 0} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-btn" onClick={() => startReceive(item)} title="Receive New Stock"><PackagePlus size={16} color="var(--primary)"/></button>
                        <button className="action-btn" onClick={() => startEdit(item)} title="Edit Item"><Edit2 size={16}/></button>
                        <button className="action-btn" onClick={() => deleteInventoryItem(item.id)} title="Delete Item" style={{ color: '#d32f2f' }}><Trash2 size={16}/></button>
                      </div>
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
