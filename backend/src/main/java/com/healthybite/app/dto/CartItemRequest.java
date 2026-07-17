package com.healthybite.app.dto;

public class CartItemRequest {
    private Long foodId;
    private Integer quantity;

    public CartItemRequest() {}

    public Long getFoodId() {
        return foodId;
    }

    public void setFoodId(Long foodId) {
        this.foodId = foodId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
