import React, { useContext, useState, useMemo } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

const POS = () => {
  const { menuItems, addSale } = useContext(AppDataContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  
  // Checkout states
  const [checkoutMode, setCheckoutMode] = useState(null); // 'select', 'cash'
  const [cashGiven, setCashGiven] = useState(0);

  // Extract unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = useMemo(() => {
    let items = menuItems.filter(item => item.available);
    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }
    return items;
  }, [menuItems, activeCategory]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
    if (cart.length === 1) {
      setCheckoutMode(null);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + tax;

  const handleCompleteCheckout = (method) => {
    if (cart.length === 0) return;
    const orderNumber = addSale(total, tax, method, cart);
    setCart([]);
    setCheckoutMode(null);
    setCashGiven(0);
  };

  const renderCheckoutSection = () => {
    if (cart.length === 0) {
      return (
        <button className="btn btn-primary checkout-btn" disabled style={{ opacity: 0.5 }}>
          Checkout
        </button>
      );
    }

    if (!checkoutMode) {
      return (
        <button className="btn btn-primary checkout-btn" onClick={() => setCheckoutMode('select')}>
          Checkout
        </button>
      );
    }

    if (checkoutMode === 'select') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>Select Payment Method</span>
            <button className="action-btn" onClick={() => setCheckoutMode(null)}><ArrowLeft size={16}/></button>
          </div>
          <button className="btn btn-secondary" onClick={() => handleCompleteCheckout('UPI')} style={{ width: '100%' }}>
            Pay via UPI
          </button>
          <button className="btn btn-primary" onClick={() => setCheckoutMode('cash')} style={{ width: '100%' }}>
            Pay via Cash
          </button>
        </div>
      );
    }

    if (checkoutMode === 'cash') {
      const change = cashGiven >= total ? cashGiven - total : 0;
      
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Cash Payment</span>
            <button className="action-btn" onClick={() => setCheckoutMode('select')}><ArrowLeft size={16}/></button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={() => setCashGiven(Math.ceil(total))}>Exact</button>
            <button className="btn btn-secondary" onClick={() => setCashGiven(100)}>₹100</button>
            <button className="btn btn-secondary" onClick={() => setCashGiven(200)}>₹200</button>
            <button className="btn btn-secondary" onClick={() => setCashGiven(500)}>₹500</button>
          </div>

          <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Cash Given:</span>
              <span style={{ fontWeight: 600 }}>₹{cashGiven.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: cashGiven >= total ? 'var(--success)' : '#d32f2f' }}>
              <span>Change to return:</span>
              <span style={{ fontWeight: 700 }}>₹{change.toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', opacity: cashGiven >= total ? 1 : 0.5 }}
            disabled={cashGiven < total}
            onClick={() => handleCompleteCheckout('Cash')}
          >
            Complete Checkout
          </button>
        </div>
      );
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Point of Sale</h1>
          <p className="page-subtitle">Tap items to add to current order</p>
        </div>
      </div>

      <div className="pos-layout">
        {/* Menu Section */}
        <div className="menu-section">
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="menu-card" onClick={() => addToCart(item)}>
                <div>
                  <div className="item-name">{item.name}</div>
                </div>
                <div className="item-price">₹{item.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <div className="cart-header">Current Order</div>
          
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-state" style={{ height: '100%', border: 'none', background: 'transparent' }}>
                Cart is empty
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{item.price} × {item.qty}</div>
                  </div>
                  <div className="cart-item-actions">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}><Minus size={14}/></button>
                    <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}><Plus size={14}/></button>
                    <button className="action-btn" onClick={() => removeItem(item.id)} style={{ color: '#d32f2f' }}>
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total Payable</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            
            {renderCheckoutSection()}
          </div>
        </div>
      </div>
    </>
  );
};

export default POS;
