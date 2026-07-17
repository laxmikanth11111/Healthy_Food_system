import React, { useEffect, useState } from 'react';
import { recipeAPI } from '../../services/api';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Loader from '../../components/Loader/Loader';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(true);

  const loadRecipes = async (searchQuery = '', diff = '') => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.query = searchQuery;
      if (diff) params.difficulty = diff;
      const res = Object.keys(params).length
        ? await recipeAPI.searchRecipes(params)
        : await recipeAPI.getRecipes();
      setRecipes(res.data);
    } catch (err) {
      console.error('Failed to load recipes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadRecipes(query, difficulty), 350);
    return () => clearTimeout(timer);
  }, [query, difficulty]);

  return (
    <div className="container py-5 animate-fade-in-up">
      <div className="text-center mb-5">
        <h2 className="fw-bold serif-font display-5 text-success mb-2">Healthy Recipes</h2>
        <p className="text-secondary">Simple, natural recipes you can cook at home &mdash; with full macros included.</p>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-7">
          <SearchBar value={query} onChange={setQuery} placeholder="Search recipes by name…" />
        </div>
      </div>

      <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
        {['', 'Easy', 'Medium', 'Hard'].map((d) => (
          <button
            key={d || 'all'}
            onClick={() => setDifficulty(d)}
            className={`btn btn-sm rounded-pill px-3 ${difficulty === d ? 'btn-primary-custom' : 'btn-outline-custom'}`}
          >
            {d || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader text="Fetching recipes…" />
      ) : recipes.length === 0 ? (
        <div className="text-center py-5 text-secondary">
          <i className="bi bi-journal-x display-4 mb-3 opacity-25 d-block"></i>
          No recipes match your search.
        </div>
      ) : (
        <div className="row g-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="col-sm-6 col-lg-4">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;