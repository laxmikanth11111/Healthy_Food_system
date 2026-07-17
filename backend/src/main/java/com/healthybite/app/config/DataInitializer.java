package com.healthybite.app.config;

import com.healthybite.app.model.*;
import com.healthybite.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize default user accounts
        if (userRepository.count() == 0) {
            User admin = new User("HealthyBite Admin", "admin@healthybite.com", passwordEncoder.encode("admin123"), Role.ROLE_ADMIN);
            admin.setAge(30);
            admin.setHeight(175.0);
            admin.setWeight(70.0);
            admin.setGender("Male");
            admin.setActivityLevel("Moderately Active");
            admin.setWeightGoal("Muscle Gain");
            admin.setDailyCalorieTarget(2500.0);
            admin.setWaterIntakeTarget(3000.0);
            userRepository.save(admin);

            User user = new User("Jane Doe", "user@healthybite.com", passwordEncoder.encode("user123"), Role.ROLE_USER);
            user.setAge(25);
            user.setHeight(165.0);
            user.setWeight(60.0);
            user.setGender("Female");
            user.setActivityLevel("Lightly Active");
            user.setWeightGoal("Weight Loss");
            user.setDailyCalorieTarget(1800.0);
            user.setWaterIntakeTarget(2200.0);
            userRepository.save(user);
        }

        // Initialize Categories
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Breakfast", "Start your day with nutrients", "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80"));
            categoryRepository.save(new Category("Salads", "Fresh and crisp natural greens", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"));
            categoryRepository.save(new Category("Smoothies", "Delicious vitamin-packed blends", "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=500&q=80"));
            categoryRepository.save(new Category("Vegan", "100% plant-based organic meals", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"));
            categoryRepository.save(new Category("Keto", "High fat, low carb energy sources", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"));
            categoryRepository.save(new Category("High Protein", "Build muscle and fuel stamina", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"));
            categoryRepository.save(new Category("Low Carb", "Lean and light options", "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80"));
            categoryRepository.save(new Category("Indian Healthy Foods", "Nutritional, spiced subcontinental classics", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80"));
        }

        // Initialize Foods
        if (foodRepository.count() == 0) {
            Category breakfast = categoryRepository.findByName("Breakfast").orElse(null);
            Category salads = categoryRepository.findByName("Salads").orElse(null);
            Category smoothies = categoryRepository.findByName("Smoothies").orElse(null);
            Category vegan = categoryRepository.findByName("Vegan").orElse(null);
            Category keto = categoryRepository.findByName("Keto").orElse(null);
            Category highProtein = categoryRepository.findByName("High Protein").orElse(null);
            Category lowCarb = categoryRepository.findByName("Low Carb").orElse(null);
            Category indian = categoryRepository.findByName("Indian Healthy Foods").orElse(null);

            Food f1 = new Food("Greek Berry Yogurt Bowl", "Probiotic Greek yogurt topped with organic honey, fresh blueberries, and crunchy house-made granola.", 
                    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80", 
                    breakfast, "High Protein", "Greek Yogurt, Blueberries, Granola, Honey, Chia Seeds", 
                    280.0, 15.0, 35.0, 6.0, 4.0, "Vitamin B12, Calcium", 249.0);
            f1.setRating(4.8);
            foodRepository.save(f1);

            Food f2 = new Food("Avocado Quinoa Salad", "Crispy kale, avocados, organic red quinoa, cherry tomatoes, and cucumber tossed in a zesty lemon-tahini vinaigrette.", 
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80", 
                    salads, "Vegan", "Quinoa, Avocado, Kale, Cherry Tomatoes, Tahini, Cucumber", 
                    350.0, 10.0, 42.0, 14.0, 8.0, "Vitamin C, Potassium", 319.0);
            f2.setRating(4.6);
            foodRepository.save(f2);

            Food f3 = new Food("Green Detox Smoothie Bowl", "Blend of organic spinach, avocados, matcha powder, bananas, and almond milk topped with pumpkin seeds and strawberries.", 
                    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=500&q=80", 
                    smoothies, "Vegan", "Spinach, Avocado, Banana, Matcha, Almond Milk, Chia Seeds", 
                    240.0, 6.0, 38.0, 8.0, 7.0, "Vitamin A, Iron", 259.0);
            f3.setRating(4.7);
            foodRepository.save(f3);

            Food f4 = new Food("Keto Grilled Salmon", "Wild-caught salmon fillet grilled with fresh dill-butter sauce, served alongside pan-seared garlic asparagus.", 
                    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=80", 
                    keto, "Keto", "Salmon, Asparagus, Butter, Garlic, Dill, Olive Oil", 
                    520.0, 36.0, 4.0, 38.0, 2.0, "Omega-3, Vitamin D", 499.0);
            f4.setRating(4.9);
            foodRepository.save(f4);

            Food f5 = new Food("Oats & Chia Seed Pudding", "Organic rolled oats, vanilla beans, chia seeds soaked overnight in coconut milk, topped with sliced almonds.", 
                    "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&w=500&q=80", 
                    breakfast, "Vegan", "Oats, Chia Seeds, Coconut Milk, Vanilla, Sliced Almonds", 
                    310.0, 8.0, 48.0, 9.0, 11.0, "Fiber, Calcium", 199.0);
            f5.setRating(4.5);
            foodRepository.save(f5);

            Food f6 = new Food("High Protein Tofu Buddha Bowl", "Sesame seared organic tofu, brown rice, edamame, shredded carrots, purple cabbage, and peanut sauce.", 
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80", 
                    vegan, "Vegan", "Organic Tofu, Brown Rice, Edamame, Carrots, Red Cabbage, Peanuts", 
                    460.0, 22.0, 52.0, 16.0, 9.0, "Iron, Zinc", 359.0);
            f6.setRating(4.6);
            foodRepository.save(f6);

            Food f7 = new Food("Keto Avocado Egg Salad", "Hard-boiled cage-free eggs, ripe avocados, celery, sugar-free Greek yogurt dressing, wrapped in crisp romaine leaves.", 
                    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80", 
                    keto, "Keto", "Eggs, Avocado, Romaine Lettuce, Greek Yogurt, Celery", 
                    390.0, 18.0, 6.0, 32.0, 4.0, "Lutein, Vitamin E", 299.0);
            f7.setRating(4.7);
            foodRepository.save(f7);

            Food f8 = new Food("Healthy Oats Khichdi", "Subcontinent style pressure-cooked whole steel-cut oats, yellow moong dal, spices, spinach, carrots, and minimal pure ghee.", 
                    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80", 
                    indian, "Low Carb", "Steel-cut Oats, Moong Dal, Spinach, Carrots, Turmeric, Ginger, Ghee", 
                    320.0, 12.0, 45.0, 7.0, 8.0, "Turmeric Curcumin, Iron", 249.0);
            f8.setRating(4.8);
            foodRepository.save(f8);

            User user = userRepository.findByEmail("user@healthybite.com").orElse(null);
            if (user != null) {
                reviewRepository.save(new Review(user, f4, 5.0, "Absolutely the best salmon I've ever had! Asparagus was perfectly crispy. Must order."));
                reviewRepository.save(new Review(user, f1, 4.5, "Very fresh berries and the yogurt is extremely creamy. Great way to start my morning."));
            }
        }

        // Initialize Recipes
        if (recipeRepository.count() == 0) {
            Recipe r1 = new Recipe();
            r1.setName("Vegan Banana Oat Pancakes");
            r1.setDescription("Fluffy, nutrient-dense plant-based pancakes made without eggs or dairy. Sweetened naturally with ripe bananas.");
            r1.setImageUrl("https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80");
            r1.setIngredients("2 ripe bananas;1 cup rolled oats;1/2 cup almond milk;1 tsp baking powder;1/2 tsp cinnamon;Pinch of salt;Coconut oil for frying");
            r1.setCookingSteps("Place bananas, rolled oats, almond milk, baking powder, cinnamon, and salt in a blender. Blend until completely smooth.;Let the batter rest for 5 minutes to thicken.;Heat a non-stick skillet over medium heat and brush lightly with coconut oil.;Pour 1/4 cup of batter for each pancake. Cook until small bubbles form on the surface (approx 2-3 minutes).;Flip carefully and cook the other side for another 1-2 minutes until golden brown.;Serve warm with fresh berries and organic maple syrup.");
            r1.setCalories(320.0);
            r1.setProtein(8.0);
            r1.setCarbs(62.0);
            r1.setFat(4.5);
            r1.setCookingTime(15);
            r1.setDifficulty("Easy");
            recipeRepository.save(r1);

            Recipe r2 = new Recipe();
            r2.setName("Low-Carb Lemon Herb Baked Cod");
            r2.setDescription("A fresh and clean fish recipe packed with protein and omega-3s, baked in a rich lemon-garlic butter glaze.");
            r2.setImageUrl("https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80");
            r2.setIngredients("4 Cod fillets;2 tbsp olive oil;3 cloves garlic minced;Zest and juice of 1 lemon;1 tsp dried oregano;Salt and black pepper to taste;Chopped fresh parsley");
            r2.setCookingSteps("Preheat oven to 400°F (200°C) and grease a baking dish with olive oil.;Pat cod fillets dry with paper towels and place them in the baking dish.;In a small bowl, whisk olive oil, minced garlic, lemon juice, lemon zest, oregano, salt, and pepper.;Pour the mixture evenly over the fish fillets.;Bake for 12-15 minutes or until the cod flakes easily with a fork.;Garnish with chopped fresh parsley and lemon wedges before serving.");
            r2.setCalories(210.0);
            r2.setProtein(24.0);
            r2.setCarbs(2.5);
            r2.setFat(12.0);
            r2.setCookingTime(20);
            r2.setDifficulty("Medium");
            recipeRepository.save(r2);
        }

        // Initialize Blogs
        if (blogRepository.count() == 0) {
            Blog b1 = new Blog();
            b1.setTitle("5 Reasons to Add Avocado to Your Daily Diet");
            b1.setContent("Avocados are a unique and delicious fruit. While most fruits consist primarily of carbohydrates, avocado is high in healthy fats. Numerous studies show that it has powerful health benefits. Here are 5 reasons why you should include avocados in your diet: 1. They are incredibly nutritious: Avocados contain 20 different vitamins and minerals, including Potassium, Folate, and Vitamins K, C, B5, B6, and E. 2. They contain more potassium than bananas, supporting healthy blood pressure levels. 3. Avocados are loaded with heart-healthy monounsaturated fatty acids, specifically oleic acid, which reduces inflammation. 4. They are loaded with fiber, supporting weight loss and digestive health. 5. Eating avocados can lower cholesterol and triglyceride levels significantly.");
            b1.setAuthor("Dr. Sarah Vance (Nutritionist)");
            b1.setImageUrl("https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=500&q=80");
            b1.setCategory("Nutrition");
            blogRepository.save(b1);

            Blog b2 = new Blog();
            b2.setTitle("How HIIT and Clean Eating Accelerate Fat Loss");
            b2.setContent("Achieving fitness goals requires a synergy of structured workouts and proper nutrition. Combining High-Intensity Interval Training (HIIT) with a diet composed of clean, natural, whole foods creates a metabolic environment optimized for fat loss and muscle preservation. HIIT boosts your metabolism through the Excess Post-exercise Oxygen Consumption (EPOC) effect, meaning you burn fat for hours after your workout. Coupling this with whole foods (avoiding refined sugars, white flour, and chemical preservatives) ensures your body receives essential micronutrients without insulin-spiking calories. Opt for green leafy vegetables, lean proteins like chicken breast or tofu, complex grains like quinoa, and plenty of water.");
            b2.setAuthor("Coach Marcus Brody");
            b2.setImageUrl("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80");
            b2.setCategory("Fitness");
            blogRepository.save(b2);
        }

        // Initialize Coupons
        if (couponRepository.count() == 0) {
            couponRepository.save(new Coupon("HEALTHY10", 10.0, 399.0));
            couponRepository.save(new Coupon("NATURAL20", 20.0, 799.0));
        }
    }
}