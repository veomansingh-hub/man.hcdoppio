import React, { useState, useContext } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { Lock } from 'lucide-react';

const Login = () => {
  const { login, isOnline } = useContext(AppDataContext);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(pin);
    if (!success) {
      setError('Invalid PIN code');
      setPin('');
    }
  };

  const handleKeypad = (num) => {
    if (pin.length < 4) {
      setPin(pin + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '24px', right: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isOnline ? 'var(--success)' : '#d32f2f' }}></div>
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>{isOnline ? 'System Online' : 'System Offline'}</span>
      </div>

      <div className="card" style={{ width: '380px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ background: '#ffebee', color: 'var(--primary)', padding: '16px', borderRadius: '50%', marginBottom: '24px' }}>
          <Lock size={32} />
        </div>
        <h2 style={{ marginBottom: '8px', fontSize: '24px' }}>System Locked</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center', fontSize: '14px' }}>
          Enter your 4-digit PIN to access the Doppio POS system.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="password"
            value={pin}
            readOnly
            style={{ 
              width: '100%', 
              textAlign: 'center', 
              fontSize: '32px', 
              letterSpacing: '8px', 
              padding: '16px', 
              borderRadius: '12px', 
              border: `2px solid ${error ? '#d32f2f' : 'var(--border)'}`, 
              marginBottom: '24px',
              outline: 'none',
              background: '#fafafa'
            }}
          />
          
          {error && <div style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '16px', marginTop: '-16px' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', marginBottom: '32px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button 
                key={num} 
                type="button" 
                onClick={() => handleKeypad(num.toString())}
                style={{ height: '60px', fontSize: '24px', borderRadius: '50%', border: 'none', background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', fontWeight: 600 }}
              >
                {num}
              </button>
            ))}
            <button type="button" onClick={() => setPin('')} style={{ height: '60px', fontSize: '16px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>C</button>
            <button type="button" onClick={() => handleKeypad('0')} style={{ height: '60px', fontSize: '24px', borderRadius: '50%', border: 'none', background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', fontWeight: 600 }}>0</button>
            <button type="button" onClick={handleDelete} style={{ height: '60px', fontSize: '16px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>DEL</button>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }} disabled={pin.length < 4}>
            Unlock System
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
