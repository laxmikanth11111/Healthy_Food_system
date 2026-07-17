import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { foodAPI } from '../../services/api';
import MealCard from '../../components/MealCard/MealCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Loader from '../../components/Loader/Loader';
import Toast from '../../components/Toast/Toast';
import { useCart } from '../../context/CartContext';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [maxCalories, setMaxCalories] = useState('');
  const [minProtein, setMinProtein] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Quick View Modal
  const [selectedFood, setSelectedFood] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const diets = [
    { name: 'All Diets', value: '' },
    { name: 'Keto', value: 'Keto' },
    { name: 'Vegan', value: 'Vegan' },
    { name: 'High Protein', value: 'High Protein' },
    { name: 'Low Carb', value: 'Low Carb' }
  ];

  // Fetch initial categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await foodAPI.getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Sync category & search from URL parameters
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlSearch) setSearchQuery(urlSearch);
  }, [searchParams]);

  // Fetch foods with filters
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const params = {
          query: searchQuery || undefined,
          categoryId: selectedCategory || undefined,
          dietType: selectedDiet || undefined,
          maxCalories: maxCalories ? parseFloat(maxCalories) : undefined,
          minProtein: minProtein ? parseFloat(minProtein) : undefined,
        };
        const response = await foodAPI.getFoods(params);
        let data = response.data;

        // Apply Sorting Client Side
        if (sortBy === 'price-asc') {
          data.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
          data.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'calories-asc') {
          data.sort((a, b) => (a.calories || 0) - (b.calories || 0));
        } else if (sortBy === 'rating-desc') {
          data.sort((a, b) => (b.rating || 5.0) - (a.rating || 5.0));
        }

        setFoods(data);
      } catch (err) {
        console.error('Failed to load food list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [searchQuery, selectedCategory, selectedDiet, maxCalories, minProtein, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDiet('');
    setMaxCalories('');
    setMinProtein('');
    setSortBy('');
    setSearchParams({});
  };

  const handleQuickView = (food) => {
    setSelectedFood(food);
  };

  return (
    <div className="container py-5 animate-fade-in-up">
      {/* Page Title */}
      <div className="text-center mb-5">
        <span className="text-success fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>Diet Choices</span>
        <h1 className="display-4 fw-bold mt-2 serif-font">Healthy Menu & Natural Food</h1>
        <p className="text-muted col-md-6 mx-auto">
          Explore delicious, nutrient-dense organic dishes crafted to support your fitness objectives. Clean eating made easy.
        </p>
        <div className="mx-auto bg-success" style={{ width: '60px', height: '3px' }}></div>
      </div>

      <div className="row">
        {/* FILTERS SIDEBAR */}
        <div className="col-lg-3 mb-4">
          <div className="card glass-card p-4 shadow-sm border-0 sticky-lg-top" style={{ top: '100px', zIndex: 10 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-success"><i className="bi bi-sliders me-2"></i>Filters</h5>
              <button onClick={handleResetFilters} className="btn btn-sm btn-link text-decoration-none text-danger fw-medium p-0">
                Clear All
              </button>
            </div>

            {/* Diet Filters */}
            <div className="mb-4">
              <label className="form-label fw-bold mb-2">Diet Plan</label>
              <div className="d-flex flex-column gap-2">
                {diets.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => setSelectedDiet(d.value)}
                    className={`btn text-start btn-sm py-2 px-3 rounded-3 border-0 transition-all ${
                      selectedDiet === d.value 
                        ? 'btn-success text-white' 
                        : 'bg-light text-secondary hover-bg-success-subtle'
                    }`}
                  >
                    <i className={`bi ${selectedDiet === d.value ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Nutrients Ranges */}
            <div className="mb-4">
              <label className="form-label fw-bold mb-2">Max Calories (kcal)</label>
              <input
                type="number"
                className="form-control form-control-sm bg-light border-0 py-2"
                placeholder="e.g. 400"
                value={maxCalories}
                onChange={(e) => setMaxCalories(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold mb-2">Min Protein (g)</label>
              <input
                type="number"
                className="form-control form-control-sm bg-light border-0 py-2"
                placeholder="e.g. 20"
                value={minProtein}
                onChange={(e) => setMinProtein(e.target.value)}
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className="form-label fw-bold mb-2">Sort By</label>
              <select
                className="form-select form-select-sm bg-light border-0 py-2 text-secondary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Default Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="calories-asc">Calories: Low to High</option>
                <option value="rating-desc">Rating: Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* FOOD GRID */}
        <div className="col-lg-9">
          {/* Search bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Category Quick Filter row */}
          <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none" style={{ whitespace: 'nowrap' }}>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchParams({});
              }}
              className={`btn btn-sm btn-rounded ${selectedCategory === '' ? 'btn-success' : 'btn-outline-custom'}`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id.toString());
                  setSearchParams({ category: cat.id.toString() });
                }}
                className={`btn btn-sm btn-rounded ${selectedCategory === cat.id.toString() ? 'btn-success' : 'btn-outline-custom'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Main Grid */}
          {loading ? (
            <Loader text="Fetching Nutrition Meals..." />
          ) : foods.length === 0 ? (
            <div className="text-center py-5 glass-card mt-3">
              <i className="bi bi-search text-muted display-1"></i>
              <h3 className="fw-bold mt-3">No Food Items Found</h3>
              <p className="text-muted mb-4">Try relaxing your search terms or expanding filter boundaries.</p>
              <button onClick={handleResetFilters} className="btn btn-primary-custom btn-rounded">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {foods.map((food) => (
                <div className="col-md-6 col-lg-4 animate-fade-in-up" key={food.id}>
                  <MealCard food={food} onQuickView={handleQuickView} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {selectedFood && (
        <div className="modal show d-block modal-glass align-items-center" tabIndex="-1" role="dialog" style={{ display: 'flex' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content border-0 p-3" style={{ borderRadius: '20px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold fs-4 text-success serif-font">{selectedFood.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedFood(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <img 
                      src={selectedFood.imageUrl} 
                      className="img-fluid rounded shadow-sm w-100 object-fit-cover" 
                      alt={selectedFood.name} 
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <span className="badge bg-success bg-opacity-75 mb-2">{selectedFood.dietType}</span>
                    <p className="text-secondary" style={{ fontSize: '0.9rem' }}>{selectedFood.description}</p>
                    
                    <h6 className="fw-bold text-success mt-3 mb-2">Nutritional Information (Macros)</h6>
                    <div className="row g-2 text-center mb-3">
                      <div className="col-6 col-sm-3">
                        <div className="bg-light p-2 rounded">
                          <small className="text-muted">Calories</small>
                          <div className="fw-bold text-dark">{selectedFood.calories} kcal</div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-3">
                        <div className="bg-light p-2 rounded">
                          <small className="text-muted">Protein</small>
                          <div className="fw-bold text-dark">{selectedFood.protein}g</div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-3">
                        <div className="bg-light p-2 rounded">
                          <small className="text-muted">Carbs</small>
                          <div className="fw-bold text-dark">{selectedFood.carbs}g</div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-3">
                        <div className="bg-light p-2 rounded">
                          <small className="text-muted">Fat</small>
                          <div className="fw-bold text-dark">{selectedFood.fat}g</div>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold text-success mb-1">Key Ingredients</h6>
                    <p className="text-secondary small mb-3">{selectedFood.ingredients}</p>

                    <h6 className="fw-bold text-success mb-1">Vitamins & Micronutrients</h6>
                    <p className="text-secondary small mb-3">{selectedFood.vitamins || 'Contains essential vitamins and fibers'}</p>

                    <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-3">
                      <span className="fs-3 fw-bold text-success">₹{selectedFood.price?.toFixed(2)}</span>
                      <button 
                        onClick={() => {
                          addToCart(selectedFood, 1);
                          setToastMsg(`${selectedFood.name} added to cart!`);
                          setSelectedFood(null);
                        }}
                        className="btn btn-primary-custom btn-rounded px-4"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
    </div>
  );
};

export default Menu;