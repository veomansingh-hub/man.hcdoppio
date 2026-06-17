import React, { useState, useContext, useEffect } from 'react';
import { Menu, Wifi, WifiOff, Clock } from 'lucide-react';
import Sidebar from './components/Sidebar';
import POS from './views/POS';
import Inventory from './views/Inventory';
import MenuEditor from './views/MenuEditor';
import Reports from './views/Reports';
import Login from './views/Login';
import { AppDataProvider, AppDataContext } from './context/AppDataContext';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>
      <Clock size={16} />
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab }) => {
  const { userRole } = useContext(AppDataContext);
  const [showMore, setShowMore] = useState(false);
  
  return (
    <>
      <div className="bottom-nav">
        <button className="bottom-nav-item" onClick={() => setShowMore(true)}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
            <div style={{width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)'}}></div>
            <div style={{width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)'}}></div>
            <div style={{width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)'}}></div>
          </div>
          More
        </button>
      </div>

      {showMore && (
        <>
          <div className="sidebar-overlay open" onClick={() => setShowMore(false)}></div>
          <div className="bottom-sheet">
            <button className="sheet-item" onClick={() => { setActiveTab('reports'); setShowMore(false); }}>
              {userRole === 'cashier' ? 'My Sales Logs' : 'Reports'}
            </button>
            {userRole !== 'cashier' && (
              <>
                <button className="sheet-item" onClick={() => { setActiveTab('inventory'); setShowMore(false); }}>Inventory</button>
                <button className="sheet-item" onClick={() => { setActiveTab('menu_editor'); setShowMore(false); }}>Menu Editor</button>
              </>
            )}
            <button className="sheet-item" onClick={() => { setActiveTab('pos'); setShowMore(false); }}>Back to POS</button>
          </div>
        </>
      )}
    </>
  );
};

function AppContent() {
  const { userRole, isOnline, fetchFromSupabase, logout } = useContext(AppDataContext);
  const [activeTab, setActiveTab] = useState('pos');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (userRole) {
      setActiveTab('pos');
    }
  }, [userRole]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  if (!userRole) {
    return <Login />;
  }

  const renderView = () => {
    if (userRole === 'cashier' && (activeTab === 'inventory' || activeTab === 'menu_editor')) return <POS />;
    switch (activeTab) {
      case 'pos': return <POS />;
      case 'inventory': return <Inventory />;
      case 'menu_editor': return <MenuEditor />;
      case 'reports': return <Reports />;
      default: return <POS />;
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await fetchFromSupabase();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <header className="global-header">
          <div className="logo-text" style={{ fontSize: '18px', letterSpacing: '1px', color: 'var(--text-main)', textTransform: 'uppercase' }}>RESTAURANT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={`network-status-dot ${isOnline ? 'online' : 'offline'}`} title={isOnline ? "Online" : "Offline"}></div>
            <div className="header-icon-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Dark Mode">☾</div>
            <div className="header-icon-btn" onClick={handleManualSync} title="Force Sync with Cloud">
              <span style={{ color: isSyncing ? '#4caf50' : 'inherit' }}>↻</span>
            </div>
            <div className="header-avatar" onClick={() => logout()} title="Logout" style={{ cursor: 'pointer' }}>
              {userRole === 'admin' ? 'A' : userRole === 'manager' ? 'M' : 'C'}
            </div>
          </div>
        </header>
        <div className="view-container">
          {renderView()}
        </div>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
}

function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}

export default App;
