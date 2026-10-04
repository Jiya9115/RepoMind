package com.demoshop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listProducts() {
        // TODO: Implement Redis cache layer for high-traffic catalog browsing
        // FIXME: Handle out-of-stock filtering in query directly
        return ResponseEntity.ok(List.of(
                Map.of("id", 1, "name", "Mechanical Keyboard", "price", 129.99, "inventory", 45),
                Map.of("id", 2, "name", "Wireless Mouse", "price", 59.99, "inventory", 120),
                Map.of("id", 3, "name", "4K Ultra-wide Monitor", "price", 499.99, "inventory", 12)
        ));
    }
}
