import React, { useContext, useState, useMemo } from 'react';
import { AppDataContext } from '../context/AppDataContext';
import { Minus, Plus, Trash2, ArrowLeft, Search, Coffee, CupSoda, Leaf, Cake, GlassWater } from 'lucide-react';

let audioCtx = null;

const playFeedback = () => {
  try {
    if (navigator.vibrate) navigator.vibrate(50);
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx) {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    }
  } catch (e) {
    console.warn('Audio feedback blocked by browser');
  }
};

const getCategoryIcon = (cat) => {
  if (!cat) return <Leaf size={20} />;
  if (cat.toLowerCase().includes('hot')) return <Coffee size={20} />;
  if (cat.toLowerCase().includes('cold')) return <CupSoda size={20} />;
  if (cat.toLowerCase().includes('food') || cat.toLowerCase().includes('pastry')) return <Cake size={20} />;
  if (cat.toLowerCase().includes('beverage')) return <GlassWater size={20} />;
  return <Leaf size={20} />;
};

const POS = () => {
  const { menuItems, addSale } = useContext(AppDataContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showMobileCart, setShowMobileCart] = useState(false);
  
  const [checkoutMode, setCheckoutMode] = useState(null);
  const [cashGiven, setCashGiven] = useState(0);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = useMemo(() => {
    let items = menuItems.filter(item => item.available);
    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }
    if (searchQuery) {
      items = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return items;
  }, [menuItems, activeCategory, searchQuery]);

  const addToCart = (item) => {
    playFeedback();
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
      if (window.innerWidth < 1024) setShowMobileCart(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCompleteCheckout = (method) => {
    if (cart.length === 0) return;
    addSale(total, tax, method, cart);
    setCart([]);
    setCheckoutMode(null);
    setCashGiven(0);
    setShowMobileCart(false);
  };

  const renderCheckoutSection = () => {
    if (cart.length === 0) {
      return <button className="btn btn-primary checkout-btn" disabled style={{ opacity: 0.5 }}>Checkout</button>;
    }
    if (!checkoutMode) {
      return <button className="btn btn-primary checkout-btn" onClick={() => setCheckoutMode('select')}>Checkout</button>;
    }
    if (checkoutMode === 'select') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>Select Payment Method</span>
            <button className="action-btn" onClick={() => setCheckoutMode(null)}><ArrowLeft size={16}/></button>
          </div>
          <button className="btn btn-secondary" onClick={() => handleCompleteCheckout('UPI')} style={{ width: '100%' }}>Pay via UPI</button>
          <button className="btn btn-primary" onClick={() => setCheckoutMode('cash')} style={{ width: '100%' }}>Pay via Cash</button>
          <button className="btn btn-secondary" onClick={() => handleCompleteCheckout('DUE')} style={{ width: '100%', background: '#ffebee', color: '#c62828', borderColor: '#ffcdd2' }}>Park Order (DUE)</button>
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
              <span>Cash Given:</span><span style={{ fontWeight: 600 }}>₹{cashGiven.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: cashGiven >= total ? 'var(--success)' : '#d32f2f' }}>
              <span>Change to return:</span><span style={{ fontWeight: 700 }}>₹{change.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', opacity: cashGiven >= total ? 1 : 0.5 }} disabled={cashGiven < total} onClick={() => handleCompleteCheckout('Cash')}>Complete Checkout</button>
        </div>
      );
    }
  };

  const renderCartSection = (isMobileSheet = false) => (
    <div className={isMobileSheet ? 'bottom-sheet' : 'cart-section'} style={isMobileSheet ? { height: '80vh' } : {}}>
      <div className="cart-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Current Order</span>
        {isMobileSheet && <button className="action-btn" onClick={() => setShowMobileCart(false)}>Close</button>}
      </div>
      <div className="cart-items" style={isMobileSheet ? { flex: 1, overflowY: 'auto' } : {}}>
        {cart.length === 0 ? (
          <div className="empty-state" style={{ height: '100%', border: 'none', background: 'transparent' }}>Cart is empty</div>
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
                <button className="action-btn" onClick={() => removeItem(item.id)} style={{ color: '#d32f2f' }}><Trash2 size={16}/></button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-footer">
        <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="summary-row"><span>GST (5%)</span><span>₹{tax.toFixed(2)}</span></div>
        <div className="summary-row total"><span>Total Payable</span><span>₹{total.toFixed(2)}</span></div>
        {renderCheckoutSection()}
      </div>
    </div>
  );

  return (
    <>
      <div className="pos-layout" style={{ display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div className="search-bar" style={{ flex: 1, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} color="var(--primary)" />
            <input 
              type="text" 
              placeholder="Search menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%' }}
            />
          </div>
          <button className="btn btn-secondary" style={{ padding: '12px 16px', background: 'white' }}>Popular First</button>
        </div>

        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? 'All' : getCategoryIcon(cat)}
            </button>
          ))}
        </div>

        <div className="menu-grid" style={{ paddingBottom: '120px' }}>
          {filteredItems.map(item => (
            <div key={item.id} className="menu-card" onClick={() => addToCart(item)}>
              <div className="item-name">{item.name}</div>
              <div className="item-price">₹{item.price}</div>
            </div>
          ))}
        </div>
      </div>

      {cart.length > 0 && !showMobileCart && (
        <button className="floating-cart-btn" onClick={() => setShowMobileCart(true)}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>{cartItemsCount}</span>
            View Cart
          </div>
          <span>₹{total.toFixed(2)}</span>
        </button>
      )}

      {showMobileCart && (
        <>
          <div className="sidebar-overlay open" onClick={() => setShowMobileCart(false)}></div>
          {renderCartSection(true)}
        </>
      )}
    </>
  );
};

export default POS;
