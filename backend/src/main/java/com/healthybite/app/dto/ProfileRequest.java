package com.healthybite.app.dto;

public class ProfileRequest {
    private String name;
    private Integer age;
    private Double height;
    private Double weight;
    private String gender;
    private String activityLevel;
    private String weightGoal;
    private Double dailyCalorieTarget;
    private Double waterIntakeTarget;

    public ProfileRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public String getWeightGoal() {
        return weightGoal;
    }

    public void setWeightGoal(String weightGoal) {
        this.weightGoal = weightGoal;
    }

    public Double getDailyCalorieTarget() {
        return dailyCalorieTarget;
    }

    public void setDailyCalorieTarget(Double dailyCalorieTarget) {
        this.dailyCalorieTarget = dailyCalorieTarget;
    }

    public Double getWaterIntakeTarget() {
        return waterIntakeTarget;
    }

    public void setWaterIntakeTarget(Double waterIntakeTarget) {
        this.waterIntakeTarget = waterIntakeTarget;
    }
}
