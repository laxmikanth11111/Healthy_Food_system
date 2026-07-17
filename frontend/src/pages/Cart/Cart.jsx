import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast/Toast';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    discount, 
    total, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    couponError,
    couponLoading 
  } = useCart();

  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const success = await applyCoupon(couponCode);
    if (success) {
      setToastMsg(`Coupon ${couponCode.toUpperCase()} applied successfully!`);
      setToastType('success');
      setCouponCode('');
    } else {
      setToastMsg(couponError || 'Invalid coupon code');
      setToastType('error');
    }
  };

  const handleCheckoutRedirect = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 animate-fade-in-up">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center py-5 glass-card">
            <i className="bi bi-cart-x text-success display-1 mb-3 opacity-25"></i>
            <h2 className="fw-bold mb-3 serif-font">Your Shopping Cart is Empty</h2>
            <p className="text-secondary mb-4">
              It seems you haven't selected any organic dishes yet. Take a look at our natural options!
            </p>
            <Link to="/menu" className="btn btn-primary-custom btn-rounded px-4 py-2">
              Browse Healthy Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 animate-fade-in-up">
      <h2 className="fw-bold mb-5 text-center serif-font display-5 text-success">Your Shopping Cart</h2>
      
      <div className="row g-4">
        {/* ITEMS LIST */}
        <div className="col-lg-8">
          <div className="card glass-card p-4 border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table align-middle text-start">
                <thead>
                  <tr className="text-secondary small text-uppercase">
                    <th>Meal</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.food.id}>
                      <td style={{ minWidth: '240px' }}>
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={item.food.imageUrl} 
                            alt={item.food.name} 
                            className="rounded-3 object-fit-cover"
                            style={{ width: '60px', height: '60px' }}
                          />
                          <div>
                            <h6 className="fw-bold mb-1">{item.food.name}</h6>
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
                              {item.food.dietType}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong className="text-secondary">₹{item.food.price.toFixed(2)}</strong>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                            className="btn btn-sm btn-light border p-0 rounded-circle"
                            style={{ width: '28px', height: '28px' }}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="fw-bold px-2">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                            className="btn btn-sm btn-light border p-0 rounded-circle"
                            style={{ width: '28px', height: '28px' }}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <strong className="text-success">₹{(item.food.price * item.quantity).toFixed(2)}</strong>
                      </td>
                      <td>
                        <button 
                          onClick={() => removeFromCart(item.food.id)}
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle p-0"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SUMMARY & COUPONS */}
        <div className="col-lg-4">
          {/* Coupon Box */}
          <div className="card glass-card p-4 border-0 shadow-sm mb-4">
            <h5 className="fw-bold text-success mb-3">Apply Coupon</h5>
            
            {appliedCoupon ? (
              <div className="d-flex align-items-center justify-content-between bg-success bg-opacity-10 p-3 rounded-3 mb-2">
                <div>
                  <span className="fw-bold text-success text-uppercase">{appliedCoupon.code}</span>
                  <small className="d-block text-secondary">{appliedCoupon.discountPercentage}% discount active</small>
                </div>
                <button onClick={removeCoupon} className="btn btn-sm btn-outline-danger border-0">
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2 text-uppercase"
                  placeholder="Enter code (HEALTHY10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="btn btn-success" type="submit" disabled={couponLoading}>
                  {couponLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Apply'}
                </button>
              </form>
            )}
            
            {couponError && <small className="text-danger mt-1 d-block"><i className="bi bi-exclamation-triangle-fill me-1"></i>{couponError}</small>}
            <small className="text-muted mt-2 d-block" style={{ fontSize: '0.78rem' }}>
              Tip: Use <strong>HEALTHY10</strong> for 10% off or <strong>NATURAL20</strong> for 20% off.
            </small>
          </div>

          {/* Pricing Details */}
          <div className="card glass-card p-4 border-0 shadow-sm">
            <h5 className="fw-bold text-success mb-4">Pricing Details</h5>
            
            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Cart Subtotal</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>

            {discount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-danger">
                <span>Coupon Discount</span>
                <strong>-₹{discount.toFixed(2)}</strong>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Shipping Delivery</span>
              <strong className="text-success">FREE</strong>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
              <span>Order Total</span>
              <span className="text-success">₹{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckoutRedirect} 
              className="btn btn-primary-custom w-100 btn-rounded py-3 fs-5 fw-semibold shadow-sm"
            >
              Checkout Order <i className="bi bi-arrow-right-short ms-1"></i>
            </button>
          </div>
        </div>
      </div>
      
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}
    </div>
  );
};

export default Cart;