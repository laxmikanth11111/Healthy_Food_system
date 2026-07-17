package com.healthybite.app.controller;

import com.healthybite.app.dto.ProfileRequest;
import com.healthybite.app.model.Food;
import com.healthybite.app.model.User;
import com.healthybite.app.repository.FoodRepository;
import com.healthybite.app.repository.UserRepository;
import com.healthybite.app.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodRepository foodRepository;

    private User getCurrentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(principal.getId()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(getCurrentUser());
    }

    @PutMapping("/profile/update")
    public ResponseEntity<User> updateProfile(@RequestBody ProfileRequest request) {
        User user = getCurrentUser();
        if (request.getName() != null) user.setName(request.getName());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getHeight() != null) user.setHeight(request.getHeight());
        if (request.getWeight() != null) user.setWeight(request.getWeight());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getActivityLevel() != null) user.setActivityLevel(request.getActivityLevel());
        if (request.getWeightGoal() != null) user.setWeightGoal(request.getWeightGoal());
        if (request.getDailyCalorieTarget() != null) user.setDailyCalorieTarget(request.getDailyCalorieTarget());
        if (request.getWaterIntakeTarget() != null) user.setWaterIntakeTarget(request.getWaterIntakeTarget());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/favorites")
    public ResponseEntity<Set<Food>> getFavorites() {
        User user = getCurrentUser();
        return ResponseEntity.ok(user.getFavorites());
    }

    @PostMapping("/favorites/add/{foodId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long foodId) {
        User user = getCurrentUser();
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food item not found"));
        user.getFavorites().add(food);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Food added to favorites", "favorites", user.getFavorites()));
    }

    @DeleteMapping("/favorites/remove/{foodId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long foodId) {
        User user = getCurrentUser();
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food item not found"));
        user.getFavorites().remove(food);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Food removed from favorites", "favorites", user.getFavorites()));
    }
}
