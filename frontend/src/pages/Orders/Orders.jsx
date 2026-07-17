import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import Toast from '../../components/Toast/Toast';

const statusColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 'bg-success';
  if (s === 'cancelled') return 'bg-danger';
  if (s === 'placed') return 'bg-primary';
  return 'bg-warning text-dark';
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const location = useLocation();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    if (location.state?.justPlacedOrderId) {
      setToastMsg('Order placed successfully! Track its status below.');
    }
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancelOrder(id);
      setToastMsg('Order cancelled.');
      loadOrders();
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Could not cancel this order.');
    }
  };

  if (loading) return <Loader text="Loading your orders…" />;

  return (
    <div className="container py-5 animate-fade-in-up">
      <h2 className="fw-bold mb-5 text-center serif-font display-5 text-success">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-receipt text-success display-1 mb-3 opacity-25"></i>
          <h4 className="fw-bold mb-3">No orders yet</h4>
          <Link to="/menu" className="btn btn-primary-custom btn-rounded px-4 py-2">Browse Healthy Menu</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card glass-card p-4 border-0 shadow-sm">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <div>
                  <h6 className="fw-bold mb-1">Order #{order.id}</h6>
                  <small className="text-muted">{new Date(order.orderDate).toLocaleString()}</small>
                </div>
                <span className={`badge ${statusColor(order.status)} px-3 py-2 rounded-pill`}>{order.status}</span>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <tbody>
                    {order.orderItems?.map((item) => (
                      <tr key={item.id}>
                        <td style={{ width: 60 }}>
                          <img src={item.food?.imageUrl} alt={item.food?.name} className="rounded-3 object-fit-cover" style={{ width: 48, height: 48 }} />
                        </td>
                        <td>{item.food?.name}</td>
                        <td className="text-muted">Qty {item.quantity}</td>
                        <td className="text-end fw-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center border-top pt-3 mt-2">
                <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                  {order.shippingAddress} · {order.phone}
                </div>
                <div className="d-flex align-items-center gap-3">
                  {order.discount > 0 && <span className="text-danger">-₹{order.discount.toFixed(2)}</span>}
                  <span className="fs-5 fw-bold text-success">₹{order.finalAmount?.toFixed(2)}</span>
                  {['Placed', 'Preparing'].includes(order.status) && (
                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleCancel(order.id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
    </div>
  );
};

export default Orders;