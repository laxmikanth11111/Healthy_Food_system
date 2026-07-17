import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const MealCard = ({ food, onQuickView }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(food, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleFavorite(food);
  };

  const dietBadgeColor = (diet) => {
    if (!diet) return 'bg-secondary';
    const d = diet.toLowerCase();
    if (d.includes('keto')) return 'bg-danger bg-opacity-75';
    if (d.includes('vegan')) return 'bg-success bg-opacity-75';
    if (d.includes('high protein') || d.includes('protein')) return 'bg-primary bg-opacity-75';
    if (d.includes('low carb') || d.includes('carb')) return 'bg-warning bg-opacity-75';
    return 'bg-success bg-opacity-75';
  };

  return (
    <div className="card glass-card h-100 overflow-hidden border-0 shadow-sm position-relative">
      {/* Diet Badge */}
      {food.dietType && (
        <span className={`position-absolute top-0 start-0 m-3 badge ${dietBadgeColor(food.dietType)} px-3 py-2 fw-medium rounded-pill`} style={{ zIndex: 10 }}>
          {food.dietType}
        </span>
      )}

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist} 
        className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center"
        style={{ width: '40px', height: '40px', zIndex: 10, color: isFavorite(food.id) ? '#d32f2f' : '#888' }}
      >
        <i className={`bi ${isFavorite(food.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      </button>

      {/* Image */}
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img 
          src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'} 
          className="card-img-top h-100 w-100 object-fit-cover transition-transform" 
          alt={food.name}
          style={{ transition: 'transform 0.5s ease' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* Body */}
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-success fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
            {food.category?.name || 'Healthy Meal'}
          </small>
          <div className="text-warning d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
            <i className="bi bi-star-fill"></i>
            <span className="fw-bold text-dark">{food.rating || '5.0'}</span>
          </div>
        </div>

        <h5 className="card-title fw-bold text-truncate mb-2" title={food.name}>
          {food.name}
        </h5>
        
        <p className="card-text text-secondary mb-3 text-truncate-2-lines" style={{ fontSize: '0.88rem', height: '40px', overflow: 'hidden' }}>
          {food.description}
        </p>

        {/* Macros */}
        <div className="row g-1 text-center mb-3">
          <div className="col-3">
            <div className="p-1 rounded bg-light" style={{ fontSize: '0.75rem' }}>
              <div className="fw-bold text-success">{food.calories ? Math.round(food.calories) : 0}</div>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>kcal</div>
            </div>
          </div>
          <div className="col-3">
            <div className="p-1 rounded bg-light" style={{ fontSize: '0.75rem' }}>
              <div className="fw-bold text-primary">{food.protein || 0}g</div>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>Protein</div>
            </div>
          </div>
          <div className="col-3">
            <div className="p-1 rounded bg-light" style={{ fontSize: '0.75rem' }}>
              <div className="fw-bold text-warning">{food.carbs || 0}g</div>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>Carbs</div>
            </div>
          </div>
          <div className="col-3">
            <div className="p-1 rounded bg-light" style={{ fontSize: '0.75rem' }}>
              <div className="fw-bold text-danger">{food.fat || 0}g</div>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>Fat</div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
          <span className="fs-4 fw-bold text-success">₹{food.price?.toFixed(2)}</span>
          <div className="d-flex gap-2">
            <button 
              onClick={() => onQuickView(food)}
              className="btn btn-outline-custom btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '35px', height: '35px' }}
              title="Quick View"
            >
              <i className="bi bi-eye"></i>
            </button>
            <button 
              onClick={handleAddToCart}
              className={`btn ${added ? 'btn-success' : 'btn-primary-custom'} btn-sm btn-rounded d-flex align-items-center gap-1`}
            >
              {added ? (
                <>
                  <i className="bi bi-check-lg"></i>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus"></i>
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;