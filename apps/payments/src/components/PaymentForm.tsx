import React, { useState } from "react";

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) {
      setError("Amount is required");
      return;
    }
    // Handle payment submission logic here
    console.log("Payment submitted:", { amount, paymentMethod });
    // Reset form
    setAmount("");
    setPaymentMethod("creditCard");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Payment Form</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Payment Method:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </label>
      </div>
      <button type="submit">Submit Payment</button>
    </form>
  );
};

export default PaymentForm;
