package com.demoshop.service;

import com.demoshop.model.Order;
import com.demoshop.model.User;
import com.demoshop.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Order createPendingOrder(User user, Double totalAmount) {
        Order order = new Order(user, totalAmount);
        order.setStatus("PENDING");
        return orderRepository.save(order);
    }

    @Transactional
    public Order finalizeOrder(Long orderId, String transactionId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
        order.setStatus("COMPLETED");
        order.setTransactionId(transactionId);
        return orderRepository.save(order);
    }

    @Transactional
    public void markFailed(Long orderId) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setStatus("FAILED");
            orderRepository.save(order);
        });
    }
}
