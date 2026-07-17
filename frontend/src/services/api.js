import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
};

export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (profileData) => API.put('/users/profile/update', profileData),
  getFavorites: () => API.get('/users/favorites'),
  addFavorite: (foodId) => API.post(`/users/favorites/add/${foodId}`),
  removeFavorite: (foodId) => API.delete(`/users/favorites/remove/${foodId}`),
};

export const foodAPI = {
  getFoods: (params) => API.get('/foods', { params }),
  getFoodById: (id) => API.get(`/foods/${id}`),
  getCategories: () => API.get('/categories'),
  getRecommendations: (goal) => API.get('/foods/recommendations', { params: { goal } }),
  getReviews: (foodId) => API.get(`/foods/${foodId}/reviews`),
  addReview: (foodId, reviewData) => API.post(`/foods/${foodId}/reviews`, reviewData),
};

export const nutritionAPI = {
  calculate: (metrics) => API.post('/nutrition/calculate', metrics),
};

export const orderAPI = {
  placeOrder: (orderData) => API.post('/orders', orderData),
  getMyOrders: () => API.get('/orders'),
  getOrderById: (id) => API.get(`/orders/${id}`),
  cancelOrder: (id) => API.post(`/orders/${id}/cancel`),
};

export const recipeAPI = {
  getRecipes: () => API.get('/recipes'),
  getRecipeById: (id) => API.get(`/recipes/${id}`),
  searchRecipes: (params) => API.get('/recipes/search', { params }),
};

export const blogAPI = {
  getBlogs: () => API.get('/blogs'),
  getBlogById: (id) => API.get(`/blogs/${id}`),
  getBlogsByCategory: (category) => API.get(`/blogs/category/${category}`),
};

export const couponAPI = {
  validateCoupon: (code) => API.get(`/coupons/validate/${code}`),
};

export const contactAPI = {
  send: (data) => API.post('/contact', data),
};

// Admin Endpoints
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),

  // Users
  getUsers: () => API.get('/admin/users'),
  updateUserRole: (id, role) => API.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),

  // Foods
  createFood: (food) => API.post('/admin/foods', food),
  updateFood: (id, food) => API.put(`/admin/foods/${id}`, food),
  deleteFood: (id) => API.delete(`/admin/foods/${id}`),

  // Categories
  createCategory: (cat) => API.post('/admin/categories', cat),
  updateCategory: (id, cat) => API.put(`/admin/categories/${id}`, cat),
  deleteCategory: (id) => API.delete(`/admin/categories/${id}`),

  // Orders
  getOrders: () => API.get('/admin/orders'),
  updateOrderStatus: (id, status) => API.put(`/admin/orders/${id}/status`, { status }),

  // Recipes
  createRecipe: (recipe) => API.post('/admin/recipes', recipe),
  updateRecipe: (id, recipe) => API.put(`/admin/recipes/${id}`, recipe),
  deleteRecipe: (id) => API.delete(`/admin/recipes/${id}`),

  // Coupons
  getCoupons: () => API.get('/admin/coupons'),
  createCoupon: (coupon) => API.post('/admin/coupons', coupon),
  toggleCoupon: (id) => API.put(`/admin/coupons/${id}`),
  deleteCoupon: (id) => API.delete(`/admin/coupons/${id}`),

  // Reviews
  getReviews: () => API.get('/admin/reviews'),
  deleteReview: (id) => API.delete(`/admin/reviews/${id}`),
};

export default API;