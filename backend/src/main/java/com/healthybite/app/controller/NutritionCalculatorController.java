package com.healthybite.app.controller;

import com.healthybite.app.dto.NutritionCalculateRequest;
import com.healthybite.app.dto.NutritionCalculateResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/nutrition")
public class NutritionCalculatorController {

    @PostMapping("/calculate")
    public ResponseEntity<NutritionCalculateResponse> calculateNutrition(@RequestBody NutritionCalculateRequest request) {
        if (request.getHeight() == null || request.getWeight() == null || request.getAge() == null) {
            return ResponseEntity.badRequest().build();
        }

        double heightInMeters = request.getHeight() / 100.0;
        double bmi = request.getWeight() / (heightInMeters * heightInMeters);
        bmi = Math.round(bmi * 10.0) / 10.0;

        String weightStatus;
        if (bmi < 18.5) {
            weightStatus = "Underweight";
        } else if (bmi < 25.0) {
            weightStatus = "Normal Weight";
        } else if (bmi < 30.0) {
            weightStatus = "Overweight";
        } else {
            weightStatus = "Obese";
        }

        // BMR Mifflin-St Jeor
        double bmr;
        if ("male".equalsIgnoreCase(request.getGender())) {
            bmr = 10 * request.getWeight() + 6.25 * request.getHeight() - 5 * request.getAge() + 5;
        } else {
            // default to female
            bmr = 10 * request.getWeight() + 6.25 * request.getHeight() - 5 * request.getAge() - 161;
        }

        // Daily Calories based on Activity Level
        double activityMultiplier = 1.2;
        double proteinMultiplier = 0.8;
        double waterMultiplier = 35.0; // ml per kg

        String act = request.getActivityLevel() != null ? request.getActivityLevel().toLowerCase() : "sedentary";
        if (act.contains("light")) {
            activityMultiplier = 1.375;
            proteinMultiplier = 1.1;
            waterMultiplier = 40.0;
        } else if (act.contains("mod")) {
            activityMultiplier = 1.55;
            proteinMultiplier = 1.4;
            waterMultiplier = 45.0;
        } else if (act.contains("very") || act.contains("active")) {
            activityMultiplier = 1.725;
            proteinMultiplier = 1.7;
            waterMultiplier = 50.0;
        } else if (act.contains("extra")) {
            activityMultiplier = 1.9;
            proteinMultiplier = 2.0;
            waterMultiplier = 55.0;
        }

        double dailyCalories = Math.round(bmr * activityMultiplier);
        double proteinRequirement = Math.round(request.getWeight() * proteinMultiplier);
        double waterIntake = Math.round(request.getWeight() * waterMultiplier);

        NutritionCalculateResponse response = new NutritionCalculateResponse(
                bmi,
                dailyCalories,
                proteinRequirement,
                waterIntake,
                weightStatus
        );

        return ResponseEntity.ok(response);
    }
}
