import React, { useState } from "react";
import { apiRequest } from "../services/api";

export const Checkout: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await apiRequest<{ status: string; order: any }>("/checkout", {
        method: "POST",
        body: JSON.stringify({
          user_id: 1,
          items: [{ product_id: 1, price: 129.99, quantity: 1 }],
          payment_method: "credit_card",
          payment_token: "tok_visa_valid"
        })
      });
      setSuccess(`Order confirmed! ID: ${response.order.id}`);
    } catch (err: any) {
      alert("Payment failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-view">
      <h2>Complete Checkout</h2>
      {success ? (
        <div className="alert-success">{success}</div>
      ) : (
        <button disabled={isProcessing} onClick={handleCheckout}>
          {isProcessing ? "Processing..." : "Pay Now ($129.99)"}
        </button>
      )}
    </div>
  );
};
