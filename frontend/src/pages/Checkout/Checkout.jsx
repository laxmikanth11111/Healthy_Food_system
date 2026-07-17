import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import Toast from '../../components/Toast/Toast';

const Checkout = () => {
  const { cartItems, subtotal, discount, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [placing, setPlacing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-bag-x text-success display-1 mb-3 opacity-25"></i>
        <h2 className="fw-bold mb-3 serif-font">Nothing to check out yet</h2>
        <Link to="/menu" className="btn btn-primary-custom btn-rounded px-4 py-2">Browse Healthy Menu</Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phone.trim()) {
      setToastType('error');
      setToastMsg('Please fill in your delivery address and phone number.');
      return;
    }

    setPlacing(true);
    try {
      const items = cartItems.map((item) => ({ foodId: item.food.id, quantity: item.quantity }));
      const payload = {
        shippingAddress,
        phone,
        items,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
      };
      const response = await orderAPI.placeOrder(payload);
      clearCart();
      navigate('/orders', { state: { justPlacedOrderId: response.data.id } });
    } catch (err) {
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in-up">
      <h2 className="fw-bold mb-5 text-center serif-font display-5 text-success">Checkout</h2>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card glass-card p-4 border-0 shadow-sm">
            <h5 className="fw-bold text-success mb-4">Delivery Details</h5>
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-3">
                <label className="form-label fw-medium">Full name</label>
                <input type="text" className="form-control bg-light border-0 py-2" value={user?.name || ''} disabled />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Shipping address</label>
                <textarea
                  className="form-control bg-light border-0 py-2"
                  rows="3"
                  placeholder="House no, street, city, pincode"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium">Phone number</label>
                <input
                  type="tel"
                  className="form-control bg-light border-0 py-2"
                  placeholder="e.g. +91 90000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary-custom w-100 btn-rounded py-3 fs-5 fw-semibold" disabled={placing}>
                {placing ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                {placing ? 'Placing your order…' : `Place order · ₹${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card glass-card p-4 border-0 shadow-sm">
            <h5 className="fw-bold text-success mb-4">Order Summary</h5>
            {cartItems.map((item) => (
              <div key={item.food.id} className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <img src={item.food.imageUrl} alt={item.food.name} className="rounded-3 object-fit-cover" style={{ width: 44, height: 44 }} />
                  <div>
                    <div className="fw-medium" style={{ fontSize: '0.9rem' }}>{item.food.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>Qty {item.quantity}</div>
                  </div>
                </div>
                <strong>₹{(item.food.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Subtotal</span><strong>₹{subtotal.toFixed(2)}</strong>
            </div>
            {discount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-danger">
                <span>Discount</span><strong>-₹{discount.toFixed(2)}</strong>
              </div>
            )}
            <div className="d-flex justify-content-between fs-5 fw-bold mt-2">
              <span>Total</span><span className="text-success">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}
    </div>
  );
};

export default Checkout;