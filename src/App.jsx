import React, { useState, useContext } from 'react';
import { Menu } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="mobile-header">
          <Menu size={24} onClick={() => setIsSidebarOpen(true)} />
          <div className="logo-text">doppio</div>
        </div>
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
