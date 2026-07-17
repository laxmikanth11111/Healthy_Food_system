import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recipeAPI } from '../../services/api';
import Loader from '../../components/Loader/Loader';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    recipeAPI.getRecipeById(id)
      .then((res) => setRecipe(res.data))
      .catch((err) => console.error('Failed to load recipe', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Loading recipe…" />;
  if (!recipe) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold">Recipe not found</h4>
        <Link to="/recipes" className="btn btn-primary-custom btn-rounded mt-3">Back to Recipes</Link>
      </div>
    );
  }

  const ingredientList = (recipe.ingredients || '').split(',').map((i) => i.trim()).filter(Boolean);
  const steps = (recipe.cookingSteps || '').split('\n').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="container py-5 animate-fade-in-up">
      <Link to="/recipes" className="text-success text-decoration-none mb-4 d-inline-block">
        <i className="bi bi-arrow-left me-2"></i>Back to Recipes
      </Link>

      <div className="row g-5">
        <div className="col-lg-6">
          <img
            src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
            alt={recipe.name}
            className="w-100 rounded-4 shadow-sm object-fit-cover"
            style={{ height: 360 }}
          />

          <div className="row g-2 mt-4 text-center">
            <div className="col-3">
              <div className="p-3 rounded-3 bg-light">
                <div className="fw-bold text-success fs-5">{recipe.calories || 0}</div>
                <small className="text-muted">kcal</small>
              </div>
            </div>
            <div className="col-3">
              <div className="p-3 rounded-3 bg-light">
                <div className="fw-bold text-primary fs-5">{recipe.protein || 0}g</div>
                <small className="text-muted">Protein</small>
              </div>
            </div>
            <div className="col-3">
              <div className="p-3 rounded-3 bg-light">
                <div className="fw-bold text-warning fs-5">{recipe.carbs || 0}g</div>
                <small className="text-muted">Carbs</small>
              </div>
            </div>
            <div className="col-3">
              <div className="p-3 rounded-3 bg-light">
                <div className="fw-bold text-danger fs-5">{recipe.fat || 0}g</div>
                <small className="text-muted">Fat</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="d-flex gap-2 mb-3">
            {recipe.difficulty && <span className="badge bg-success bg-opacity-75 px-3 py-2 rounded-pill">{recipe.difficulty}</span>}
            <span className="badge bg-dark bg-opacity-75 px-3 py-2 rounded-pill">
              <i className="bi bi-clock me-1"></i>{recipe.cookingTime} mins
            </span>
          </div>

          <h1 className="fw-bold serif-font mb-3">{recipe.name}</h1>
          <p className="text-secondary mb-4">{recipe.description}</p>

          {ingredientList.length > 0 && (
            <>
              <h5 className="fw-bold text-success mb-3">Ingredients</h5>
              <ul className="list-unstyled mb-4">
                {ingredientList.map((ing, i) => (
                  <li key={i} className="mb-2 d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success"></i>{ing}
                  </li>
                ))}
              </ul>
            </>
          )}

          {steps.length > 0 && (
            <>
              <h5 className="fw-bold text-success mb-3">Method</h5>
              <ol className="ps-3">
                {steps.map((step, i) => (
                  <li key={i} className="mb-3 text-secondary">{step}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;