import React, { useState, useContext } from 'react';
import Sidebar from './components/Sidebar';
import POS from './views/POS';
import Inventory from './views/Inventory';
import MenuEditor from './views/MenuEditor';
import Reports from './views/Reports';
import Login from './views/Login';
import { AppDataProvider, AppDataContext } from './context/AppDataContext';

function AppContent() {
  const { userRole } = useContext(AppDataContext);
  const [activeTab, setActiveTab] = useState('pos');

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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderView()}
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
