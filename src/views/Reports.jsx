import React, { useContext } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { IndianRupee, ReceiptText, TrendingUp, Percent } from 'lucide-react';

const Reports = () => {
  const { sales } = useContext(AppDataContext);

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
      </div>
    </>
  );
};

export default Reports;
