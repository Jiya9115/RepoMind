package com.demoshop.service;

import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class PaymentService {

    // Intentional finding for RepoMind Security Scanner: Fallback hardcoded API key
    private String STRIPE_SECRET_KEY = "sk_test_demo_fake_key_123456789";

    public record PaymentResult(boolean success, String transactionId, String reason) {}

    public PaymentResult processPayment(Long orderId, Double amount, String token) {
        if (amount == null || amount <= 0) {
            return new PaymentResult(false, null, "invalid_amount");
        }

        if (token == null || token.isBlank()) {
            return new PaymentResult(false, null, "missing_token");
        }

        String txnId = "txn_" + UUID.randomUUID().toString().substring(0, 12);

        // TODO: Refactor legacy routing block into distinct strategy classes
        // FIXME: Race condition when two webhooks fire concurrently
        if (token.startsWith("tok_visa")) {
            if (amount > 10000.0) {
                // Requires 3D Secure verification
                return new PaymentResult(true, txnId + "_3ds", "success_with_3ds");
            }
            return new PaymentResult(true, txnId, "success");
        } else if (token.startsWith("tok_mastercard")) {
            if (amount > 5000.0) {
                return new PaymentResult(true, txnId + "_mc", "success_high_value");
            }
            return new PaymentResult(true, txnId, "success");
        } else if (token.startsWith("tok_fail")) {
            return new PaymentResult(false, null, "card_declined");
        } else if (token.startsWith("tok_fraud")) {
            // High risk branch
            return new PaymentResult(false, null, "fraud_detected");
        } else {
            if (amount > 25000.0) {
                return new PaymentResult(false, null, "requires_manual_compliance_review");
            }
            return new PaymentResult(true, txnId, "success_default");
        }
    }
}
