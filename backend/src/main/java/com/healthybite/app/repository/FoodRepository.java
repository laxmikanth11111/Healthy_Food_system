package com.healthybite.app.repository;

import com.healthybite.app.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByNameContainingIgnoreCase(String name);
    List<Food> findByCategoryId(Long categoryId);
    List<Food> findByDietTypeIgnoreCase(String dietType);
    List<Food> findByPriceLessThanEqual(Double price);
    List<Food> findByCaloriesLessThanEqual(Double calories);
    List<Food> findByProteinGreaterThanEqual(Double protein);

    @Query("SELECT f FROM Food f WHERE " +
           "(:query IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(f.ingredients) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:categoryId IS NULL OR f.category.id = :categoryId) AND " +
           "(:dietType IS NULL OR LOWER(f.dietType) = LOWER(:dietType)) AND " +
           "(:maxCalories IS NULL OR f.calories <= :maxCalories) AND " +
           "(:minProtein IS NULL OR f.protein >= :minProtein) AND " +
           "(:maxPrice IS NULL OR f.price <= :maxPrice)")
    List<Food> searchFoods(@Param("query") String query,
                           @Param("categoryId") Long categoryId,
                           @Param("dietType") String dietType,
                           @Param("maxCalories") Double maxCalories,
                           @Param("minProtein") Double minProtein,
                           @Param("maxPrice") Double maxPrice);
}
