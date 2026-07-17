package com.healthybite.app.controller;

import com.healthybite.app.model.Coupon;
import com.healthybite.app.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validateCoupon(@PathVariable String code) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code)
                .orElse(null);

        if (coupon == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or inactive coupon code"));
        }

        if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "This coupon code has expired"));
        }

        return ResponseEntity.ok(coupon);
    }
}
