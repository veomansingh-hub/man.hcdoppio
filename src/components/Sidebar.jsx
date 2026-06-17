import React, { useContext } from 'react';
import { LayoutDashboard, ShoppingCart, ClipboardList, PenTool, X } from 'lucide-react';
import { AppDataContext } from '../context/AppDataContext';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { inventory, userRole, logout, isOnline } = useContext(AppDataContext);

  const hasCritical = inventory.some(i => i.computedStatus === 'Critical');
  const hasLow = inventory.some(i => i.computedStatus === 'Low Stock');

  const getInventoryIcon = () => {
    return (
      <div style={{ position: 'relative', display: 'flex' }}>
        <ClipboardList size={20} />
        {(hasCritical || hasLow) && (
          <div className={`notification-dot ${hasCritical ? 'critical' : 'low'}`} style={{ top: '-4px', right: '-8px' }}></div>
        )}
      </div>
    );
  };

  const allTabs = [
    { id: 'pos', name: 'POS', icon: <ShoppingCart size={20} /> },
    { id: 'inventory', name: 'Inventory', icon: getInventoryIcon() },
    { id: 'menu_editor', name: 'Menu Editor', icon: <PenTool size={20} /> },
    { id: 'reports', name: 'Reports', icon: <LayoutDashboard size={20} /> },
  ];

  const tabs = userRole === 'cashier' 
    ? allTabs.filter(t => t.id === 'pos' || t.id === 'reports') 
    : allTabs;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div className="logo-text">doppio</div>
              <div className="logo-subtext">CAFE</div>
            </div>
            <X className="mobile-only-close" size={24} style={{ display: 'none', cursor: 'pointer' }} onClick={onClose} />
          </div>
        </div>
      
      <nav className="sidebar-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              if (window.innerWidth <= 1024) onClose();
            }}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="avatar" style={{ position: 'relative' }}>
              {userRole === 'manager' ? 'M' : 'C'}
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: isOnline ? 'var(--success)' : '#d32f2f',
                position: 'absolute', bottom: '0', right: '0',
                border: '2px solid var(--surface)'
              }}></div>
            </div>
            <div className="details">
              <span className="name">{userRole === 'manager' ? 'Manager' : 'Cashier'}</span>
              <span className="role">{userRole === 'manager' ? 'Full Access' : 'POS Only'}</span>
            </div>
          </div>
          <button onClick={logout} className="action-btn" style={{ background: '#ffeeee', color: '#d32f2f', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
