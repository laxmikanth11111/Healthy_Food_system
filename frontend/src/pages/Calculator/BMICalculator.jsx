import React, { useState } from 'react';
import { nutritionAPI, foodAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import MealCard from '../../components/MealCard/MealCard';
import Loader from '../../components/Loader/Loader';
import Toast from '../../components/Toast/Toast';

const BMICalculator = () => {
  const { isAuthenticated, updateProfile } = useAuth();
  
  // Inputs
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('Male');
  const [activityLevel, setActivityLevel] = useState('Moderately Active');
  const [goal, setGoal] = useState('Weight Loss');

  // Outputs
  const [results, setResults] = useState(null);
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [selectedFood, setSelectedFood] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!age || !height || !weight) {
      setToastMsg('Please enter valid age, height, and weight.');
      setToastType('error');
      return;
    }

    setLoading(false);
    try {
      const response = await nutritionAPI.calculate({
        age: parseInt(age),
        height: parseFloat(height),
        weight: parseFloat(weight),
        gender,
        activityLevel
      });
      
      setResults(response.data);
      
      // Fetch recommendations based on goal
      setRecLoading(true);
      const recResponse = await foodAPI.getRecommendations(goal);
      setRecommendedMeals(recResponse.data);
      
      setToastMsg('Nutrition targets calculated successfully!');
      setToastType('success');
    } catch (err) {
      console.error('Calculation error:', err);
      setToastMsg('Failed to calculate nutrition targets.');
      setToastType('error');
    } finally {
      setRecLoading(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!results) return;
    try {
      await updateProfile({
        age: parseInt(age),
        height: parseFloat(height),
        weight: parseFloat(weight),
        gender,
        activityLevel,
        weightGoal: goal,
        dailyCalorieTarget: results.dailyCalories,
        waterIntakeTarget: results.waterIntake
      });
      setToastMsg('Targets saved to your profile!');
      setToastType('success');
    } catch (err) {
      console.error('Save to profile error:', err);
      setToastMsg('Failed to update profile targets.');
      setToastType('error');
    }
  };

  const getBmiBarPercentage = (bmi) => {
    // scale from 15 to 35
    if (bmi < 15) return 0;
    if (bmi > 35) return 100;
    return ((bmi - 15) / 20) * 100;
  };

  const getBmiColor = (status) => {
    if (!status) return 'text-secondary';
    const s = status.toLowerCase();
    if (s.includes('underweight')) return 'text-warning';
    if (s.includes('normal')) return 'text-success';
    if (s.includes('overweight')) return 'text-warning';
    return 'text-danger';
  };

  const getBmiBg = (status) => {
    if (!status) return 'bg-secondary';
    const s = status.toLowerCase();
    if (s.includes('underweight')) return 'bg-warning';
    if (s.includes('normal')) return 'bg-success';
    if (s.includes('overweight')) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="container py-5 animate-fade-in-up">
      {/* Title */}
      <div className="text-center mb-5">
        <span className="text-success fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>Smart Calculator</span>
        <h1 className="display-4 fw-bold mt-2 serif-font">BMI & Calorie Calculator</h1>
        <div className="mx-auto bg-success" style={{ width: '60px', height: '3px' }}></div>
      </div>

      <div className="row g-4">
        {/* INPUTS PANEL */}
        <div className="col-lg-5">
          <div className="card glass-card p-4 p-md-5 border-0 shadow-sm">
            <h4 className="fw-bold mb-4 text-success"><i className="bi bi-calculator me-2"></i>Enter Metrics</h4>
            
            <form onSubmit={handleCalculate}>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Age</label>
                  <input
                    type="number"
                    className="form-control bg-light border-0 py-2"
                    placeholder="e.g. 25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Gender</label>
                  <select
                    className="form-select bg-light border-0 py-2 text-secondary"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Height (cm)</label>
                  <input
                    type="number"
                    className="form-control bg-light border-0 py-2"
                    placeholder="e.g. 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control bg-light border-0 py-2"
                    placeholder="e.g. 65"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Activity Level</label>
                <select
                  className="form-select bg-light border-0 py-2 text-secondary"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="Sedentary">Sedentary (Little or no exercise)</option>
                  <option value="Lightly Active">Lightly Active (Exercise 1-3 days/wk)</option>
                  <option value="Moderately Active">Moderately Active (Exercise 3-5 days/wk)</option>
                  <option value="Very Active">Very Active (Exercise 6-7 days/wk)</option>
                  <option value="Extra Active">Extra Active (Hard labor / double exercise)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Dietary Goal</label>
                <select
                  className="form-select bg-light border-0 py-2 text-secondary"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="Weight Loss">Weight Loss (Caloric Deficit)</option>
                  <option value="Weight Gain">Weight Gain (Caloric Surplus)</option>
                  <option value="Muscle Gain">Muscle Gain (High Protein)</option>
                  <option value="Low Carb">Low Carb (Lean Cut)</option>
                  <option value="Keto">Keto (High Fat/Zero Carb)</option>
                  <option value="Vegan">Vegan (Plant Based)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 btn-rounded py-2 fw-semibold">
                Calculate Targets
              </button>
            </form>
          </div>
        </div>

        {/* OUTPUTS PANEL */}
        <div className="col-lg-7">
          {results ? (
            <div className="card glass-card p-4 p-md-5 border-0 shadow-sm h-100 animate-fade-in-up">
              <h4 className="fw-bold mb-4 text-success"><i className="bi bi-activity me-2"></i>Your Calorie & Metric Profile</h4>
              
              <div className="row g-4 mb-4">
                {/* BMI Card */}
                <div className="col-md-6">
                  <div className="bg-light p-4 rounded-4 text-center">
                    <small className="text-secondary fw-semibold">Body Mass Index (BMI)</small>
                    <div className="display-4 fw-bold text-success my-2">{results.bmi}</div>
                    <span className={`badge ${getBmiBg(results.weightStatus)} px-3 py-2 fw-medium rounded-pill`}>
                      {results.weightStatus}
                    </span>
                  </div>
                </div>

                {/* Calorie Card */}
                <div className="col-md-6">
                  <div className="bg-light p-4 rounded-4 text-center h-100 d-flex flex-column justify-content-center">
                    <small className="text-secondary fw-semibold">Daily Calories Requirement</small>
                    <div className="display-4 fw-bold text-success my-2">{results.dailyCalories}</div>
                    <small className="text-muted">kcal / day</small>
                  </div>
                </div>
              </div>

              {/* BMI Progress Bar visual */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1 small text-muted">
                  <span>15.0 (Underweight)</span>
                  <span>25.0 (Overweight)</span>
                  <span>35.0 (Obese)</span>
                </div>
                <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                  <div 
                    className={`progress-bar ${getBmiBg(results.weightStatus)}`} 
                    role="progressbar" 
                    style={{ width: `${getBmiBarPercentage(results.bmi)}%` }} 
                    aria-valuenow={results.bmi} 
                    aria-valuemin="15" 
                    aria-valuemax="35"
                  ></div>
                </div>
              </div>

              {/* Detailed metrics breakdown */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="border border-success border-opacity-10 p-3 rounded-3 d-flex align-items-center gap-3">
                    <i className="bi bi-egg-fill text-primary fs-3"></i>
                    <div>
                      <small className="text-muted d-block">Protein Target</small>
                      <strong className="fs-5">{results.proteinRequirement} grams</strong>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="border border-success border-opacity-10 p-3 rounded-3 d-flex align-items-center gap-3">
                    <i className="bi bi-droplet-half text-info fs-3"></i>
                    <div>
                      <small className="text-muted d-block">Daily Water Target</small>
                      <strong className="fs-5">{results.waterIntake} ml</strong>
                    </div>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <button onClick={handleSaveToProfile} className="btn btn-success btn-rounded w-100 py-2 fw-semibold shadow-sm">
                  <i className="bi bi-cloud-arrow-up-fill me-2"></i> Save Targets to Profile Dashboard
                </button>
              ) : (
                <div className="alert alert-info border-0 p-3 rounded mb-0 text-center" style={{ fontSize: '0.88rem' }}>
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <Link to="/login" className="text-decoration-none fw-bold text-success">Log In</Link> to save these metric targets to your account dashboard!
                </div>
              )}
            </div>
          ) : (
            <div className="card glass-card p-4 p-md-5 border-0 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center text-center">
              <i className="bi bi-calculator text-success display-1 mb-3 opacity-25"></i>
              <h4 className="fw-bold">No Metrics Calculated Yet</h4>
              <p className="text-muted max-width-350">
                Input your age, gender, height, and weight, then select your dietary goal to view your customized caloric targets.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC RECOMMENDATIONS SECTION */}
      {results && (
        <section className="mt-5 pt-3 animate-fade-in-up">
          <div className="text-center mb-5">
            <span className="text-success fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Smart Engine</span>
            <h2 className="display-6 fw-bold mt-2 serif-font">Recommended Meals for: {goal}</h2>
            <div className="mx-auto bg-success" style={{ width: '60px', height: '3px' }}></div>
          </div>

          {recLoading ? (
            <Loader text="Selecting Recommended Dishes..." />
          ) : (
            <div className="row g-4">
              {recommendedMeals.map((food) => (
                <div className="col-md-4" key={food.id}>
                  <MealCard food={food} onQuickView={(f) => setSelectedFood(f)} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

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
                          setToastType('success');
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

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}
    </div>
  );
};

export default BMICalculator;