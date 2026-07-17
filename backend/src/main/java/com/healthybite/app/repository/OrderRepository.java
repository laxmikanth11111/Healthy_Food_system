package com.healthybite.app.repository;

import com.healthybite.app.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    @Query("SELECT COALESCE(SUM(o.finalAmount), 0.0) FROM Order o WHERE o.status <> 'Cancelled'")
    Double getTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'Placed'")
    Long getPendingOrderCount();
}
