package com.healthybite.app.dto;

public class NutritionCalculateRequest {
    private Integer age;
    private Double height; // in cm
    private Double weight; // in kg
    private String gender; // Male/Female
    private String activityLevel; // Sedentary, Lightly Active, Moderately Active, Very Active, Extra Active

    public NutritionCalculateRequest() {}

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(String activityLevel) {
        this.activityLevel = activityLevel;
    }
}
