package com.healthybite.app.controller;

import com.healthybite.app.model.Recipe;
import com.healthybite.app.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @GetMapping
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        return ResponseEntity.ok(recipeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        return ResponseEntity.ok(recipe);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Recipe>> searchRecipes(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String difficulty) {
        if (query != null && !query.trim().isEmpty()) {
            return ResponseEntity.ok(recipeRepository.findByNameContainingIgnoreCase(query));
        } else if (difficulty != null && !difficulty.trim().isEmpty()) {
            return ResponseEntity.ok(recipeRepository.findByDifficultyIgnoreCase(difficulty));
        }
        return ResponseEntity.ok(recipeRepository.findAll());
    }
}
