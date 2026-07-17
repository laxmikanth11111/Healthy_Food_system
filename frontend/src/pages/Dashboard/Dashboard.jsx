import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import MealCard from '../../components/MealCard/MealCard';
import Toast from '../../components/Toast/Toast';

const GOALS = ['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Maintain Weight'];
const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extra Active'];

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const { favorites } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'wishlist' ? 'wishlist' : 'profile';

  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    gender: user?.gender || '',
    activityLevel: user?.activityLevel || '',
    weightGoal: user?.weightGoal || '',
    dailyCalorieTarget: user?.dailyCalorieTarget || '',
    waterIntakeTarget: user?.waterIntakeTarget || '',
  });
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        ...form,
        age: form.age ? Number(form.age) : null,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        dailyCalorieTarget: form.dailyCalorieTarget ? Number(form.dailyCalorieTarget) : null,
        waterIntakeTarget: form.waterIntakeTarget ? Number(form.waterIntakeTarget) : null,
      });
      setToastMsg('Profile updated successfully!');
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in-up">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
        <div>
          <h2 className="fw-bold serif-font display-6 mb-1">Hi, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-secondary mb-0">Manage your profile and saved favorites.</p>
        </div>
        <Link to="/orders" className="btn btn-outline-custom btn-rounded px-4">
          <i className="bi bi-receipt me-2"></i>My Orders
        </Link>
      </div>

      <ul className="nav nav-pills gap-2 mb-4">
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'profile' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
            onClick={() => setSearchParams({ tab: 'profile' })}
          >
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'wishlist' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
            onClick={() => setSearchParams({ tab: 'wishlist' })}
          >
            Wishlist ({favorites.length})
          </button>
        </li>
      </ul>

      {activeTab === 'profile' ? (
        <div className="card glass-card p-4 p-md-5 border-0 shadow-sm" style={{ maxWidth: 760 }}>
          <form onSubmit={handleSave}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">Name</label>
                <input type="text" className="form-control bg-light border-0 py-2" value={form.name} onChange={handleChange('name')} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Email</label>
                <input type="email" className="form-control bg-light border-0 py-2" value={user?.email || ''} disabled />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label fw-medium">Age</label>
                <input type="number" className="form-control bg-light border-0 py-2" value={form.age} onChange={handleChange('age')} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Height (cm)</label>
                <input type="number" className="form-control bg-light border-0 py-2" value={form.height} onChange={handleChange('height')} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Weight (kg)</label>
                <input type="number" className="form-control bg-light border-0 py-2" value={form.weight} onChange={handleChange('weight')} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Gender</label>
                <select className="form-select bg-light border-0 py-2" value={form.gender} onChange={handleChange('gender')}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">Activity level</label>
                <select className="form-select bg-light border-0 py-2" value={form.activityLevel} onChange={handleChange('activityLevel')}>
                  <option value="">Select</option>
                  {ACTIVITY_LEVELS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Weight goal</label>
                <select className="form-select bg-light border-0 py-2" value={form.weightGoal} onChange={handleChange('weightGoal')}>
                  <option value="">Select</option>
                  {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-medium">Daily calorie target</label>
                <input type="number" className="form-control bg-light border-0 py-2" value={form.dailyCalorieTarget} onChange={handleChange('dailyCalorieTarget')} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Water intake target (ml)</label>
                <input type="number" className="form-control bg-light border-0 py-2" value={form.waterIntakeTarget} onChange={handleChange('waterIntakeTarget')} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary-custom btn-rounded px-4 py-2" disabled={saving}>
              {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>
      ) : (
        <>
          {favorites.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-heart display-4 mb-3 opacity-25 d-block"></i>
              No favorites yet &mdash; tap the heart icon on any dish to save it here.
              <div className="mt-3">
                <Link to="/menu" className="btn btn-primary-custom btn-rounded px-4">Browse Menu</Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {favorites.map((food) => (
                <div key={food.id} className="col-sm-6 col-lg-4">
                  <MealCard food={food} onQuickView={() => {}} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
    </div>
  );
};

export default Dashboard;