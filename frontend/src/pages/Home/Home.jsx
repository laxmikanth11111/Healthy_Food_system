import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { foodAPI } from '../../services/api';
import MealCard from '../../components/MealCard/MealCard';
import Loader from '../../components/Loader/Loader';
import Toast from '../../components/Toast/Toast';
import { useCart } from '../../context/CartContext';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const navigate = useNavigate();
  const { addToCart } = useCart();


  const nutritionTips = [
    {
      title: "Stay Hydrated!",
      text: "Drinking water before meals can boost metabolism by 24-30% over 1-1.5 hours, helping you burn off a few more calories.",
      icon: "bi-droplet-fill"
    },
    {
      title: "Eat More Greens",
      text: "Leafy greens are loaded with fiber and nutrients that keep you satiated. Try to include spinach, kale, or arugula in at least one meal a day.",
      icon: "bi-tree-fill"
    },
    {
      title: "Limit Processed Sugars",
      text: "Added sugar is one of the worst ingredients in the modern diet. Replace sweet snacks with fruits, berries, or Greek yogurt bowls.",
      icon: "bi-exclamation-triangle-fill"
    },
    {
      title: "Prioritize Lean Protein",
      text: "Eating enough protein is vital for optimal health. It can significantly boost metabolic rate and keep you feeling full, reducing cravings.",
      icon: "bi-activity"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await foodAPI.getCategories();
        setCategories(catRes.data.slice(0, 4)); // Show first 4 on home

        const foodRes = await foodAPI.getFoods();
        // filter foods with rating >= 4.7
        const featured = foodRes.data.filter(f => f.rating >= 4.7).slice(0, 3);
        setFeaturedMeals(featured.length > 0 ? featured : foodRes.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to load home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickView = (food) => {
    setSelectedFood(food);
  };

  return (
    <div className="home-container animate-fade-in-up">
      {/* 1. HERO SECTION */}
      <section className="nature-gradient py-5 position-relative overflow-hidden mb-5" style={{ borderRadius: '0 0 50px 50px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container position-relative" style={{ zIndex: 5 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <h1 className="display-3 fw-bold mb-3 serif-font" style={{ lineHeight: '1.2' }}>
                Nourish Your Body With <span className="text-warning">Natural Foods</span>
              </h1>
              <p className="lead mb-4 opacity-90" style={{ fontSize: '1.2rem' }}>
                HealthyBite brings you personalized organic meal recommendations, natural category choices, and nutrition calculations to help you stay energetic and clean.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-4">
                <Link to="/menu" className="btn btn-secondary-custom btn-rounded btn-lg text-white shadow">
                  Explore Healthy Menu
                </Link>
                <Link to="/calculator" className="btn btn-outline-light btn-rounded btn-lg">
                  Calculate BMI
                </Link>
              </div>

              {/* Quick Search */}
              <form onSubmit={handleSearchSubmit} className="d-inline-block w-100" style={{ maxWidth: '500px' }}>
                <div className="input-group bg-white bg-opacity-25 rounded-pill p-1 border border-white border-opacity-25 shadow-sm" style={{ backdropFilter: 'blur(8px)' }}>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 text-white placeholder-light shadow-none ps-3 py-2"
                    placeholder="Search organic ingredients (e.g. Avocado, Salmon)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ color: 'white' }}
                  />
                  <button className="btn btn-light rounded-pill px-4 fw-medium text-success" type="submit">
                    Search
                  </button>
                </div>
              </form>
            </div>
            
            <div className="col-lg-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" 
                alt="Healthy food bowl" 
                className="img-fluid rounded-circle border border-5 border-white shadow-lg animate-pulse-slow"
                style={{ maxWidth: '85%', height: 'auto', animation: 'pulse 6s infinite' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES */}
      <section className="container mb-5 py-3">
        <div className="text-center mb-5">
          <span className="text-success fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>Dietary Sectors</span>
          <h2 className="display-5 fw-bold mt-2 serif-font">Popular Organic Categories</h2>
          <div className="mx-auto bg-success" style={{ width: '60px', height: '3px' }}></div>
        </div>
        
        {loading ? (
          <Loader text="Preparing Categories..." />
        ) : (
          <div className="row g-4 justify-content-center">
            {categories.map((cat) => (
              <div className="col-lg-3 col-md-6" key={cat.id}>
                <div 
                  onClick={() => navigate(`/menu?category=${cat.id}`)}
                  className="card glass-card h-100 border-0 p-3 shadow-sm text-center cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={cat.imageUrl} 
                    className="rounded-circle mx-auto mb-3 object-fit-cover" 
                    style={{ width: '100px', height: '100px' }} 
                    alt={cat.name} 
                  />
                  <h4 className="fw-bold fs-5">{cat.name}</h4>
                  <p className="text-muted small mb-0">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED MEALS */}
      <section className="bg-light py-5 mb-5" style={{ borderRadius: '40px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-success fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>Chef's Specials</span>
            <h2 className="display-5 fw-bold mt-2 serif-font">Featured Healthy Meals</h2>
            <div className="mx-auto bg-success" style={{ width: '60px', height: '3px' }}></div>
          </div>

          {loading ? (
            <Loader text="Polishing Special Dishes..." />
          ) : (
            <div className="row g-4">
              {featuredMeals.map((food) => (
                <div className="col-md-4" key={food.id}>
                  <MealCard food={food} onQuickView={handleQuickView} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-5">
            <Link to="/menu" className="btn btn-outline-custom btn-lg btn-rounded">
              View Entire Menu
            </Link>
          </div>
        </div>
      </section>

      {/* 4. DAILY NUTRITION TIPS WIDGET */}
      <section className="container mb-5 py-4">
        <div className="row align-items-center bg-success bg-opacity-10 p-4 p-md-5 rounded-4 shadow-sm mx-1">
          <div className="col-lg-5 col-md-6 mb-4 mb-md-0">
            <span className="text-success fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Micro learning</span>
            <h3 className="display-6 fw-bold mt-2 serif-font">Daily Nutrition & Diet Tips</h3>
            <p className="text-secondary mt-3">
              Small nutritional updates accumulate into life-changing improvements. Review our curated cards to enhance your eating schedule.
            </p>
            <div className="d-flex gap-2 mt-4">
              {nutritionTips.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTipIndex(idx)}
                  className={`btn rounded-circle p-0 ${activeTipIndex === idx ? 'btn-success' : 'btn-outline-success'}`}
                  style={{ width: '30px', height: '30px' }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="col-lg-7 col-md-6">
            <div className="card glass-card border-0 p-4 shadow-lg text-start animate-fade-in-up" key={activeTipIndex}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <i className={`bi ${nutritionTips[activeTipIndex].icon} fs-4`}></i>
                </div>
                <h4 className="fw-bold mb-0 text-success">{nutritionTips[activeTipIndex].title}</h4>
              </div>
              <p className="mb-0 fs-5" style={{ lineHeight: '1.6', fontWeight: 300 }}>
                "{nutritionTips[activeTipIndex].text}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="container mb-5 py-4">
        <div className="text-center mb-5">
          <span className="text-success fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>Reviews</span>
          <h2 className="display-5 fw-bold mt-2 serif-font">What Our Customers Say</h2>
          <div className="mx-auto bg-success" style={{ width: '60px', height: '3px' }}></div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card glass-card border-0 p-4 shadow-sm text-center h-100">
              <i className="bi bi-quote text-success display-4 opacity-50 mb-2"></i>
              <p className="text-secondary small mb-4 italic">
                "The BMI Calculator set my calorie targets perfectly! The menu is delicious; I especially love the Keto Salmon. I've lost 5 kg in a month!"
              </p>
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Sarah" className="rounded-circle mx-auto mb-2" style={{ width: '60px', height: '60px' }} />
              <h6 className="fw-bold mb-0">Sarah Jenkins</h6>
              <small className="text-muted">Active Member</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card glass-card border-0 p-4 shadow-sm text-center h-100">
              <i className="bi bi-quote text-success display-4 opacity-50 mb-2"></i>
              <p className="text-secondary small mb-4 italic">
                "Finding high protein meals that actually taste good was a challenge until HealthyBite. The tofu buddha bowls are my post-workout favorite."
              </p>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="David" className="rounded-circle mx-auto mb-2" style={{ width: '60px', height: '60px' }} />
              <h6 className="fw-bold mb-0">David Miller</h6>
              <small className="text-muted">Fitness Instructor</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card glass-card border-0 p-4 shadow-sm text-center h-100">
              <i className="bi bi-quote text-success display-4 opacity-50 mb-2"></i>
              <p className="text-secondary small mb-4 italic">
                "Excellent delivery and incredibly premium food aesthetics. Applying the HEALTHY10 coupon worked smoothly. Highly recommend the green matcha bowls!"
              </p>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Elena" className="rounded-circle mx-auto mb-2" style={{ width: '60px', height: '60px' }} />
              <h6 className="fw-bold mb-0">Elena Rostova</h6>
              <small className="text-muted">Dietitian</small>
            </div>
          </div>
        </div>
      </section>

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

export default Home;