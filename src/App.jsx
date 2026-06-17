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

function AppContent() {
  const { userRole, isOnline } = useContext(AppDataContext);
  const [activeTab, setActiveTab] = useState('pos');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Force navigate to POS on every login
  useEffect(() => {
    if (userRole) {
      setActiveTab('pos');
      setIsSidebarOpen(false);
    }
  }, [userRole]);

  if (!userRole) {
    return <Login />;
  }

  const renderView = () => {
    if (userRole === 'cashier' && (activeTab === 'inventory' || activeTab === 'menu_editor')) {
      return <POS />;
    }

    switch (activeTab) {
      case 'pos': return <POS />;
      case 'inventory': return <Inventory />;
      case 'menu_editor': return <MenuEditor />;
      case 'reports': return <Reports />;
      default: return <POS />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="main-content">
        <header className="global-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={28} />
            </button>
            <div className="logo-text" style={{ fontSize: '24px' }}>doppio</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <LiveClock />
            <div className={`network-badge ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span>{isOnline ? 'Supabase Online' : 'Offline Mode'}</span>
            </div>
          </div>
        </header>
        <div className="view-container">
          {renderView()}
        </div>
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
