import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const difficultyBadgeColor = (difficulty) => {
    if (!difficulty) return 'bg-secondary';
    const d = difficulty.toLowerCase();
    if (d === 'easy') return 'bg-success bg-opacity-75';
    if (d === 'medium') return 'bg-warning text-dark bg-opacity-75';
    if (d === 'hard') return 'bg-danger bg-opacity-75';
    return 'bg-secondary';
  };

  return (
    <div className="card glass-card h-100 overflow-hidden border-0 shadow-sm position-relative">
      {/* Difficulty Badge */}
      {recipe.difficulty && (
        <span className={`position-absolute top-0 start-0 m-3 badge ${difficultyBadgeColor(recipe.difficulty)} px-3 py-2 fw-medium rounded-pill`} style={{ zIndex: 10 }}>
          {recipe.difficulty}
        </span>
      )}

      {/* Cooking Time Badge */}
      <span className="position-absolute top-0 end-0 m-3 badge bg-dark bg-opacity-75 px-3 py-2 fw-medium rounded-pill" style={{ zIndex: 10 }}>
        <i className="bi bi-clock me-1"></i> {recipe.cookingTime} mins
      </span>

      {/* Image */}
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img 
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'} 
          className="card-img-top h-100 w-100 object-fit-cover" 
          alt={recipe.name}
        />
      </div>

      {/* Body */}
      <div className="card-body d-flex flex-column p-4">
        <h5 className="card-title fw-bold text-truncate mb-2" title={recipe.name}>
          {recipe.name}
        </h5>
        
        <p className="card-text text-secondary mb-3 text-truncate-3-lines" style={{ fontSize: '0.88rem', height: '60px', overflow: 'hidden' }}>
          {recipe.description}
        </p>

        {/* Info row */}
        <div className="d-flex justify-content-between align-items-center mb-3 text-secondary" style={{ fontSize: '0.8rem' }}>
          <span><strong className="text-dark">{recipe.calories || 0}</strong> kcal</span>
          <span><strong className="text-dark">{recipe.protein || 0}g</strong> protein</span>
          <span><strong className="text-dark">{recipe.carbs || 0}g</strong> carbs</span>
        </div>

        <div className="mt-auto pt-3 border-top">
          <Link to={`/recipes/${recipe.id}`} className="btn btn-primary-custom w-100 btn-rounded">
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
