package com.demoshop.controller;

import com.demoshop.model.Order;
import com.demoshop.model.User;
import com.demoshop.service.OrderService;
import com.demoshop.service.PaymentService;
import com.demoshop.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final UserService userService;
    private final OrderService orderService;
    private final PaymentService paymentService;

    public OrderController(UserService userService, OrderService orderService, PaymentService paymentService) {
        this.userService = userService;
        this.orderService = orderService;
        this.paymentService = paymentService;
    }

    public record CheckoutRequest(Long userId, List<Map<String, Object>> items, String paymentToken) {}

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        // High coupling orchestration
        User user = userService.getUserById(request.userId())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        double total = request.items().stream()
                .mapToDouble(i -> ((Number) i.getOrDefault("price", 0.0)).doubleValue())
                .sum();

        Order order = orderService.createPendingOrder(user, total);

        PaymentService.PaymentResult result = paymentService.processPayment(order.getId(), total, request.paymentToken());
        if (!result.success()) {
            orderService.markFailed(order.getId());
            return ResponseEntity.badRequest().body(Map.of("error", "Payment declined: " + result.reason()));
        }

        Order completedOrder = orderService.finalizeOrder(order.getId(), result.transactionId());
        return ResponseEntity.ok(Map.of("status", "success", "order", completedOrder));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam String query) {
        // Security finding test pattern: raw SQL string concatenation
        String rawQuery = "SELECT * FROM products WHERE name = '" + query + "'";
        return ResponseEntity.ok(Map.of("query", query, "rawQueryExecuted", rawQuery));
    }
}
