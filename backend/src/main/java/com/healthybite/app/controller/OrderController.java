package com.healthybite.app.controller;

import com.healthybite.app.dto.CartItemRequest;
import com.healthybite.app.dto.OrderRequest;
import com.healthybite.app.model.*;
import com.healthybite.app.repository.*;
import com.healthybite.app.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CouponRepository couponRepository;

    private User getCurrentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(principal.getId()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        User user = getCurrentUser();

        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cart is empty"));
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setPhone(request.getPhone());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("Placed");

        double totalAmount = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItemRequest itemReq : request.getItems()) {
            Food food = foodRepository.findById(itemReq.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food item not found: " + itemReq.getFoodId()));
            
            OrderItem orderItem = new OrderItem(order, food, itemReq.getQuantity(), food.getPrice());
            orderItems.add(orderItem);
            totalAmount += food.getPrice() * itemReq.getQuantity();
        }

        order.setTotalAmount(totalAmount);
        double discount = 0.0;

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(request.getCouponCode())
                    .orElse(null);
            if (coupon != null && coupon.getExpiryDate().isAfter(LocalDateTime.now())) {
                order.setCouponCode(coupon.getCode());
                discount = totalAmount * (coupon.getDiscountPercentage() / 100.0);
                if (coupon.getMaxDiscount() != null && discount > coupon.getMaxDiscount()) {
                    discount = coupon.getMaxDiscount();
                }
            }
        }

        order.setDiscount(discount);
        order.setFinalAmount(totalAmount - discount);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders() {
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Allow if it belongs to the user OR user is admin
        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(Role.ROLE_ADMIN)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        return ResponseEntity.ok(order);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(Role.ROLE_ADMIN)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        if ("Delivered".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Delivered orders cannot be cancelled"));
        }

        order.setStatus("Cancelled");
        orderRepository.save(order);
        return ResponseEntity.ok(Map.of("message", "Order cancelled successfully", "order", order));
    }
}
