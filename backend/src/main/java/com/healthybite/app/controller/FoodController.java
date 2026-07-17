package com.healthybite.app.controller;

import com.healthybite.app.model.Category;
import com.healthybite.app.model.Food;
import com.healthybite.app.model.Review;
import com.healthybite.app.model.User;
import com.healthybite.app.repository.CategoryRepository;
import com.healthybite.app.repository.FoodRepository;
import com.healthybite.app.repository.ReviewRepository;
import com.healthybite.app.repository.UserRepository;
import com.healthybite.app.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/foods")
    public ResponseEntity<List<Food>> getFoods(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String dietType,
            @RequestParam(required = false) Double maxCalories,
            @RequestParam(required = false) Double minProtein,
            @RequestParam(required = false) Double maxPrice) {

        List<Food> foods = foodRepository.searchFoods(
                (query != null && !query.trim().isEmpty()) ? query : null,
                categoryId,
                (dietType != null && !dietType.trim().isEmpty()) ? dietType : null,
                maxCalories,
                minProtein,
                maxPrice
        );
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/foods/{id}")
    public ResponseEntity<Food> getFoodById(@PathVariable Long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found"));
        return ResponseEntity.ok(food);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/foods/{id}/reviews")
    public ResponseEntity<List<Review>> getReviewsByFood(@PathVariable Long id) {
        return ResponseEntity.ok(reviewRepository.findByFoodIdOrderByReviewDateDesc(id));
    }

    @PostMapping("/foods/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(principal.getId()).orElseThrow();
        Food food = foodRepository.findById(id).orElseThrow();

        Double rating = Double.valueOf(request.get("rating").toString());
        String comment = request.get("comment").toString();

        Review review = new Review(user, food, rating, comment);
        Review savedReview = reviewRepository.save(review);

        // Update average food rating
        List<Review> reviews = reviewRepository.findByFoodIdOrderByReviewDateDesc(id);
        double avgRating = reviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
        food.setRating(Math.round(avgRating * 10.0) / 10.0);
        foodRepository.save(food);

        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/foods/recommendations")
    public ResponseEntity<List<Food>> getRecommendations(@RequestParam(required = false) String goal) {
        List<Food> allFoods = foodRepository.findAll();

        if (goal == null || goal.trim().isEmpty()) {
            return ResponseEntity.ok(allFoods.stream().limit(6).collect(Collectors.toList()));
        }

        String targetGoal = goal.toLowerCase();
        List<Food> recommendations = allFoods.stream().filter(food -> {
            switch (targetGoal) {
                case "weight loss":
                    return food.getCalories() != null && food.getCalories() <= 400;
                case "weight gain":
                    return food.getCalories() != null && food.getCalories() >= 550;
                case "muscle gain":
                case "high protein":
                    return food.getProtein() != null && food.getProtein() >= 20.0;
                case "diabetic diet":
                case "low carb":
                    return food.getCarbs() != null && food.getCarbs() <= 20.0;
                case "heart healthy":
                    return food.getFat() != null && food.getFat() <= 10.0;
                case "keto":
                    return (food.getDietType() != null && food.getDietType().equalsIgnoreCase("Keto")) 
                            || (food.getCarbs() != null && food.getCarbs() <= 10.0 && food.getFat() != null && food.getFat() >= 15.0);
                case "vegan":
                    return (food.getDietType() != null && food.getDietType().equalsIgnoreCase("Vegan")) 
                            || (food.getCategory() != null && food.getCategory().getName().equalsIgnoreCase("Vegan"));
                default:
                    return true;
            }
        }).collect(Collectors.toList());

        // fallback if filter is too restrictive
        if (recommendations.isEmpty()) {
            recommendations = allFoods.stream().limit(4).collect(Collectors.toList());
        }

        return ResponseEntity.ok(recommendations);
    }
}
