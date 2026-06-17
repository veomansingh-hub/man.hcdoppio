import React, { useContext, useState } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { IndianRupee, ReceiptText, TrendingUp, Percent, Download, Upload, AlertTriangle, Database } from 'lucide-react';
import { exportToJSON, exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';

const Reports = () => {
  const { sales, inventory, menuItems, resetSystem } = useContext(AppDataContext);
  const [resetPin, setResetPin] = useState('');

  const handleExport = (format) => {
    const backupData = { menuItems, inventory, sales };
    if (format === 'json') exportToJSON(backupData, 'doppio_backup');
    else if (format === 'csv') exportToCSV(sales, 'doppio_sales');
    else if (format === 'xlsx') exportToExcel(inventory, 'doppio_inventory');
    else if (format === 'pdf') exportToPDF(sales, 'doppio_sales_report', 'Sales Report');
  };

  const handleReset = () => {
    if (!resetPin) return;
    const success = resetSystem(resetPin);
    if (success) {
      alert('System reset to factory defaults successfully!');
      setResetPin('');
    } else {
      alert('Invalid Manager PIN');
    }
  };

  const handleImport = (e) => {
    // Basic import logic UI hook
    if (e.target.files.length > 0) {
      alert(`Imported ${e.target.files[0].name} (Logic simulated for demo)`);
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = sales.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0);

  // Group by payment method
  const paymentMix = sales.reduce((acc, sale) => {
    acc[sale.method] = (acc[sale.method] || 0) + 1;
    return acc;
  }, {});

  const methodPercentages = Object.keys(paymentMix).map(method => ({
    method,
    percentage: Math.round((paymentMix[method] / totalOrders) * 100)
  }));

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Reports</h1>
          <p className="page-subtitle">Revenue, payments & tax analytics</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon revenue"><IndianRupee size={24}/></div>
          <div className="kpi-details">
            <div className="label">Revenue this week</div>
            <div className="value">₹{totalRevenue.toFixed(2)}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orders"><ReceiptText size={24}/></div>
          <div className="kpi-details">
            <div className="label">Orders this week</div>
            <div className="value">{totalOrders}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon aov"><TrendingUp size={24}/></div>
          <div className="kpi-details">
            <div className="label">Avg order value</div>
            <div className="value">₹{avgOrderValue.toFixed(2)}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon tax"><Percent size={24}/></div>
          <div className="kpi-details">
            <div className="label">GST collected</div>
            <div className="value">₹{totalTax.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Daily revenue</div>
          {totalOrders === 0 ? (
            <div className="empty-state">No transaction data available yet</div>
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingTop: '20px' }}>
              <div style={{ width: '40px', height: '100%', background: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '40px', height: '60%', background: '#ffccbc', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '40px', height: '80%', background: '#ffccbc', borderRadius: '4px 4px 0 0' }}></div>
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-title">Payment mix</div>
          {totalOrders === 0 ? (
            <div className="empty-state">No payment data</div>
          ) : (
            <div style={{ padding: '20px 0' }}>
              {methodPercentages.map(m => (
                <div key={m.method} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                    <span>{m.method}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{m.percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="chart-title">Tax summary</div>
          <div className="table-container">
            <table>
              <tbody>
                <tr>
                  <td>GST @ 5% (food & beverage)</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{totalTax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Net taxable sales</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{totalRevenue.toFixed(2)}</td>
                </tr>
                <tr style={{ background: '#fafafa' }}>
                  <td style={{ fontWeight: 700 }}>Total tax payable</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>₹{totalTax.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      <div className="chart-card" style={{ gridColumn: 'span 2', marginTop: '24px' }}>
        <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Database size={20}/> Data Management & Backup</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          <div>
            <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text-muted)' }}>Export / Import Data</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button className="btn btn-secondary" onClick={() => handleExport('json')}><Download size={16}/> JSON Backup</button>
              <button className="btn btn-secondary" onClick={() => handleExport('xlsx')}><Download size={16}/> Excel (Inventory)</button>
              <button className="btn btn-secondary" onClick={() => handleExport('csv')}><Download size={16}/> CSV (Sales)</button>
              <button className="btn btn-secondary" onClick={() => handleExport('pdf')}><Download size={16}/> PDF Report</button>
            </div>
            <div style={{ position: 'relative' }}>
              <input type="file" id="import-file" style={{ display: 'none' }} onChange={handleImport} accept=".json,.csv,.xlsx" />
              <label htmlFor="import-file" className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}><Upload size={16}/> Import Data</label>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '40px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '16px', color: '#d32f2f', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={16}/> Danger Zone</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Resetting the system will clear all local data and truncate the remote Supabase database.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="password" 
                placeholder="Manager PIN" 
                className="form-input" 
                style={{ width: '150px' }}
                value={resetPin}
                onChange={e => setResetPin(e.target.value)}
              />
              <button className="btn btn-primary" style={{ background: '#d32f2f' }} onClick={handleReset}>Factory Reset</button>
            </div>
          </div>

        </div>
      </div>
      </div>
    </>
  );
};

export default Reports;
