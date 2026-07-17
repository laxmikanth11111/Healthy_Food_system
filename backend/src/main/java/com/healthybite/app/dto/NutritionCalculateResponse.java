package com.healthybite.app.dto;

public class NutritionCalculateResponse {
    private Double bmi;
    private Double dailyCalories;
    private Double proteinRequirement;
    private Double waterIntake;
    private String weightStatus;

    public NutritionCalculateResponse() {}

    public NutritionCalculateResponse(Double bmi, Double dailyCalories, Double proteinRequirement, Double waterIntake, String weightStatus) {
        this.bmi = bmi;
        this.dailyCalories = dailyCalories;
        this.proteinRequirement = proteinRequirement;
        this.waterIntake = waterIntake;
        this.weightStatus = weightStatus;
    }

    public Double getBmi() {
        return bmi;
    }

    public void setBmi(Double bmi) {
        this.bmi = bmi;
    }

    public Double getDailyCalories() {
        return dailyCalories;
    }

    public void setDailyCalories(Double dailyCalories) {
        this.dailyCalories = dailyCalories;
    }

    public Double getProteinRequirement() {
        return proteinRequirement;
    }

    public void setProteinRequirement(Double proteinRequirement) {
        this.proteinRequirement = proteinRequirement;
    }

    public Double getWaterIntake() {
        return waterIntake;
    }

    public void setWaterIntake(Double waterIntake) {
        this.waterIntake = waterIntake;
    }

    public String getWeightStatus() {
        return weightStatus;
    }

    public void setWeightStatus(String weightStatus) {
        this.weightStatus = weightStatus;
    }
}
