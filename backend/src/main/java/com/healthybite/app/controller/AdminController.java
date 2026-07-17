package com.healthybite.app.controller;

import com.healthybite.app.model.*;
import com.healthybite.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private com.healthybite.app.repository.ContactMessageRepository contactMessageRepository;

    // --- CONTACT MESSAGES ---
    @GetMapping("/contact-messages")
    public ResponseEntity<List<com.healthybite.app.model.ContactMessage>> getContactMessages() {
        return ResponseEntity.ok(contactMessageRepository.findAllByOrderBySubmittedDateDesc());
    }

    // --- DASHBOARD STATS ---
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long usersCount = userRepository.count();
        long foodsCount = foodRepository.count();
        long ordersCount = orderRepository.count();
        long categoriesCount = categoryRepository.count();
        double totalRevenue = orderRepository.getTotalRevenue();
        long pendingOrders = orderRepository.getPendingOrderCount();

        // Sample Popular Foods
        List<Food> popularFoods = foodRepository.findAll().stream()
                .filter(f -> f.getRating() >= 4.5)
                .limit(5)
                .toList();

        Map<String, Object> stats = new HashMap<>();
        stats.put("usersCount", usersCount);
        stats.put("foodsCount", foodsCount);
        stats.put("ordersCount", ordersCount);
        stats.put("categoriesCount", categoriesCount);
        stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        stats.put("pendingOrders", pendingOrders);
        stats.put("popularFoods", popularFoods);

        return ResponseEntity.ok(stats);
    }

    // --- USER MANAGEMENT ---
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String newRole = request.get("role");
        if (newRole != null) {
            user.setRole(Role.valueOf(newRole.toUpperCase()));
            userRepository.save(user);
        }
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // --- FOOD CRUD ---
    @PostMapping("/foods")
    public ResponseEntity<Food> createFood(@RequestBody Food food) {
        if (food.getCategory() != null && food.getCategory().getId() != null) {
            Category category = categoryRepository.findById(food.getCategory().getId()).orElse(null);
            food.setCategory(category);
        }
        Food savedFood = foodRepository.save(food);
        return ResponseEntity.ok(savedFood);
    }

    @PutMapping("/foods/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable Long id, @RequestBody Food foodDetails) {
        Food food = foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
        food.setName(foodDetails.getName());
        food.setDescription(foodDetails.getDescription());
        food.setImageUrl(foodDetails.getImageUrl());
        food.setDietType(foodDetails.getDietType());
        food.setIngredients(foodDetails.getIngredients());
        food.setCalories(foodDetails.getCalories());
        food.setProtein(foodDetails.getProtein());
        food.setCarbs(foodDetails.getCarbs());
        food.setFat(foodDetails.getFat());
        food.setFiber(foodDetails.getFiber());
        food.setVitamins(foodDetails.getVitamins());
        food.setPrice(foodDetails.getPrice());

        if (foodDetails.getCategory() != null && foodDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(foodDetails.getCategory().getId()).orElse(null);
            food.setCategory(category);
        }

        Food updatedFood = foodRepository.save(food);
        return ResponseEntity.ok(updatedFood);
    }

    @DeleteMapping("/foods/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable Long id) {
        foodRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Food deleted successfully"));
    }

    // --- CATEGORY CRUD ---
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category catDetails) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(catDetails.getName());
        category.setDescription(catDetails.getDescription());
        category.setImageUrl(catDetails.getImageUrl());
        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
    }

    // --- ORDER STATUS MANAGEMENT ---
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        String newStatus = request.get("status");
        if (newStatus != null) {
            order.setStatus(newStatus);
            orderRepository.save(order);
        }
        return ResponseEntity.ok(order);
    }

    // --- RECIPE CRUD ---
    @PostMapping("/recipes")
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
        Recipe savedRecipe = recipeRepository.save(recipe);
        return ResponseEntity.ok(savedRecipe);
    }

    @PutMapping("/recipes/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe details) {
        Recipe recipe = recipeRepository.findById(id).orElseThrow(() -> new RuntimeException("Recipe not found"));
        recipe.setName(details.getName());
        recipe.setDescription(details.getDescription());
        recipe.setImageUrl(details.getImageUrl());
        recipe.setIngredients(details.getIngredients());
        recipe.setCookingSteps(details.getCookingSteps());
        recipe.setCalories(details.getCalories());
        recipe.setProtein(details.getProtein());
        recipe.setCarbs(details.getCarbs());
        recipe.setFat(details.getFat());
        recipe.setCookingTime(details.getCookingTime());
        recipe.setDifficulty(details.getDifficulty());

        Recipe updated = recipeRepository.save(recipe);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        recipeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Recipe deleted successfully"));
    }

    // --- COUPON MANAGEMENT ---
    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponRepository.findAll());
    }

    @PostMapping("/coupons")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        Coupon saved = couponRepository.save(coupon);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<Coupon> toggleCoupon(@PathVariable Long id) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setActive(!coupon.getActive());
        Coupon updated = couponRepository.save(coupon);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        couponRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Coupon deleted successfully"));
    }

    // --- REVIEWS LIST AND MODERATION ---
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        Food food = review.getFood();
        reviewRepository.deleteById(id);

        // recalculate rating
        List<Review> reviews = reviewRepository.findByFoodIdOrderByReviewDateDesc(food.getId());
        double avgRating = reviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
        food.setRating(Math.round(avgRating * 10.0) / 10.0);
        foodRepository.save(food);

        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}