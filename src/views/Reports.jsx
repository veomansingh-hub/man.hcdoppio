import React, { useContext, useState, useMemo } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { IndianRupee, ReceiptText, TrendingUp, Percent, Download, Upload, AlertTriangle, Database, Calendar } from 'lucide-react';
import { exportToJSON, exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';
import { startOfWeek, endOfWeek, isWithinInterval, isSameDay, format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const { sales, inventory, menuItems, resetSystem } = useContext(AppDataContext);
  const [resetPin, setResetPin] = useState('');

  // Default to current week
  const today = new Date();
  const [startDate, setStartDate] = useState(format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'));

  const handleExport = (formatType) => {
    const backupData = { menuItems, inventory, sales };
    
    // Format sales data for CSV/PDF to prevent [object Object] errors
    const formattedSales = sales.map(s => ({
      ...s,
      items: s.items ? s.items.map(i => `${i.quantity}x ${i.name}`).join(', ') : ''
    }));

    if (formatType === 'json') exportToJSON(backupData, 'doppio_backup');
    else if (formatType === 'csv') exportToCSV(formattedSales, 'doppio_sales');
    else if (formatType === 'xlsx') exportToExcel(inventory, 'doppio_inventory');
    else if (formatType === 'pdf') exportToPDF(formattedSales, 'doppio_sales_report', 'Sales Report');
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

  // 1. Calculate Today's Revenue (Independent of date picker)
  const todaysRevenue = sales
    .filter(sale => isSameDay(new Date(sale.date), today))
    .reduce((sum, sale) => sum + sale.total, 0);

  // 2. Filter sales by selected date range
  const filteredSales = useMemo(() => {
    if (!startDate || !endDate) return sales;
    const start = new Date(startDate);
    start.setHours(0,0,0,0);
    const end = new Date(endDate);
    end.setHours(23,59,59,999);
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return isWithinInterval(saleDate, { start, end });
    });
  }, [sales, startDate, endDate]);

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = filteredSales.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalTax = filteredSales.reduce((sum, sale) => sum + sale.tax, 0);

  // 3. Group filtered sales for the Chart
  const chartData = useMemo(() => {
    const grouped = {};
    filteredSales.forEach(sale => {
      const day = format(new Date(sale.date), 'MMM dd');
      if (!grouped[day]) grouped[day] = 0;
      grouped[day] += sale.total;
    });
    
    // Convert to array and sort by date logically if we had real date objects, but for now object keys order is usually chronological enough, or we can sort:
    return Object.keys(grouped).map(dateStr => ({
      name: dateStr,
      Revenue: grouped[dateStr]
    }));
  }, [filteredSales]);

  // Group by payment method
  const paymentMix = filteredSales.reduce((acc, sale) => {
    acc[sale.method] = (acc[sale.method] || 0) + 1;
    return acc;
  }, {});

  const methodPercentages = Object.keys(paymentMix).map(method => ({
    method,
    percentage: Math.round((paymentMix[method] / totalOrders) * 100)
  }));

  return (
    <>
      <div className="page-header reports-header">
        <div>
          <h1 className="page-title">Sales Reports</h1>
          <p className="page-subtitle">Revenue, payments & tax analytics</p>
        </div>
        
        <div className="date-filters">
          <div className="date-input-group">
            <Calendar size={16} className="date-icon" />
            <input 
              type="date" 
              className="date-picker" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="date-separator">to</span>
          <div className="date-input-group">
            <Calendar size={16} className="date-icon" />
            <input 
              type="date" 
              className="date-picker" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card highlight-today">
          <div className="kpi-icon today-rev"><IndianRupee size={24}/></div>
          <div className="kpi-details">
            <div className="label">Today's Revenue</div>
            <div className="value">₹{todaysRevenue.toFixed(2)}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon revenue"><IndianRupee size={24}/></div>
          <div className="kpi-details">
            <div className="label">Period Revenue</div>
            <div className="value">₹{totalRevenue.toFixed(2)}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orders"><ReceiptText size={24}/></div>
          <div className="kpi-details">
            <div className="label">Period Orders</div>
            <div className="value">{totalOrders}</div>
          </div>
        </div>
        <div className="kpi-card hide-mobile">
          <div className="kpi-icon aov"><TrendingUp size={24}/></div>
          <div className="kpi-details">
            <div className="label">Avg order value</div>
            <div className="value">₹{avgOrderValue.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Revenue Graph (Selected Period)</div>
          {chartData.length === 0 ? (
            <div className="empty-state">No transaction data available for this period</div>
          ) : (
            <div className="recharts-wrapper" style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f5f5f5'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Bar dataKey="Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-title">Payment mix</div>
          {methodPercentages.length === 0 ? (
            <div className="empty-state">No data</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {methodPercentages.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: i===0?'#ff9800':'#ffcc80' }}></div>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{m.method}</span>
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{m.percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Tax summary (Selected Period)</h3>
        <div className="summary-row">
          <span>GST @ 5% (food & beverage)</span>
          <span style={{ fontWeight: 600 }}>₹{totalTax.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Net taxable sales</span>
          <span style={{ fontWeight: 600 }}>₹{totalRevenue.toFixed(2)}</span>
        </div>
        <div className="summary-row total" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <span style={{ color: '#ff6d00' }}>Total tax payable</span>
          <span style={{ color: '#ff6d00' }}>₹{totalTax.toFixed(2)}</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ReceiptText size={18}/> Transaction Log (Selected Period)
        </h3>
        {filteredSales.length === 0 ? (
          <div className="empty-state">No transactions in this period</div>
        ) : (
          <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date & Time</th>
                  <th>Items</th>
                  <th>Method</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredSales].reverse().map(sale => {
                  const saleDate = new Date(sale.date);
                  return (
                    <tr key={sale.id}>
                      <td style={{ fontWeight: 500 }}>{sale.orderNumber}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{saleDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {saleDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                        </div>
                      </td>
                      <td>
                        {sale.items && sale.items.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '13px' }}>{item.quantity}x {item.name}</div>
                        ))}
                      </td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          background: 'var(--background)', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          border: '1px solid var(--border)'
                        }}>
                          {sale.method}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{sale.total.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18}/> Data Management & Backup
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Download system backups or export financial reports for accounting.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => handleExport('csv')}>
            <Download size={16}/> Export Sales CSV
          </button>
          <button className="btn btn-secondary" onClick={() => handleExport('pdf')}>
            <Download size={16}/> Export Sales PDF
          </button>
          <button className="btn btn-secondary" onClick={() => handleExport('xlsx')}>
            <Download size={16}/> Export Inventory Excel
          </button>
          <button className="btn btn-primary" onClick={() => handleExport('json')}>
            <Database size={16}/> Full Backup (JSON)
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px', border: '1px solid #ffcdd2', background: '#fffafb' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#c62828', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18}/> Danger Zone
        </h3>
        <p style={{ fontSize: '14px', color: '#b71c1c', marginBottom: '16px' }}>
          This action will permanently delete all sales and reset inventory/menu to defaults. Cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter Manager PIN to verify" 
              value={resetPin}
              onChange={(e) => setResetPin(e.target.value)}
              style={{ width: '250px' }}
            />
          </div>
          <button className="btn btn-primary" style={{ background: '#c62828' }} onClick={handleReset}>
            Factory Reset System
          </button>
        </div>
      </div>
    </>
  );
};

export default Reports;
