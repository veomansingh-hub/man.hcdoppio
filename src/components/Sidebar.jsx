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
              if (window.innerWidth < 768) onClose();
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
          <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            Logout
          </button>
        </div>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
