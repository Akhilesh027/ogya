import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./buy.css";
import cod from "../pages/Images/cod.webp";
import razorpayimg from "../pages/Images/pg.jpg";
import Footer from "./footer";

const Buy = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    streetAddress: "",
    townCity: "",
    state: "",
    pinCode: "",
    phone: "",
    email: "",
    userId: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const location = useLocation();
  const { cartItems, totalAmount, userId } = location.state || {
    cartItems: [],
    totalAmount: 0,
    userId: null,
  };
  const navigate = useNavigate();

  useEffect(() => {
    // Apply delivery charge if totalAmount is less than 500
    setDeliveryCharge(totalAmount < 500 ? 50 : 0);
  }, [totalAmount]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const generateRandomOrderId = () => {
    return "ORDER_" + Math.floor(Math.random() * 1000000000);
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);

    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment();
    } else if (paymentMethod === "cod") {
      // const paymentDetails = {
      //   orderId: generateRandomOrderId(), // Unique order ID for COD
      //   paymentMethod: "Cash on Delivery",
      //   paymentStatus: "Confirmed", // Set to confirmed for COD
      //   transactionId: null, // No transaction ID for COD
      //   amount: totalAmount + deliveryCharge, // Correct calculatio
      // };
      // await submitOrder(paymentDetails);
       alert("cash on delivery is not available!");
    }
  };
  const handleRazorpayPayment = async () => {
    try {
      // Create an order on the backend
      const { data: orderData } = await axios.post(
        "https://ogya.onrender.com/api/create-order",
        {
          ...formData,
          userId: userId, // Include userId in the order creation
          amount: (totalAmount + deliveryCharge) * 100, // Convert to paise for Razorpay
        }
      );

      // Initiate Razorpay payment
      const options = {
        key: "rzp_live_qO97ytpJFY75xi", // Your Razorpay key ID
        amount: orderData.amount, // Amount in paise
        currency: orderData.currency,
        name: "ogya", // Your company name
        description: "Payment for order",
        order_id: orderData.orderId, // This is the order ID you got from the backend
        handler: async (response) => {
          try {
            // Payment successful
            const verificationResponse = await axios.post(
              "https://ogya.onrender.com/api/payment/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            // Check if payment verification was successful
            if (verificationResponse.status === 200) {
              // After successful payment, submit the order
              const paymentDetails = {
                orderId: orderData.orderId, // Use Razorpay order ID
                paymentMethod: "Razorpay",
                paymentStatus: "Completed", // Set status as completed
                transactionId: response.razorpay_payment_id, // Store payment ID
                amount: orderData.amount / 100, // Convert back to original amount
              };

              // Submit order to API
              await submitOrder(paymentDetails); // Submit order with payment details
              alert("Payment successful! Your order has been placed.");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Error during payment verification:", error);
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: `${formData.fullname}`, // Use template literals for full name
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#F37254", // Customize your theme color
        },
      };

      // Create a new instance of Razorpay and open the payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner on any error or after payment process
    }
  };

  const submitOrder = async (paymentDetails) => {
    try {
      const orderData = {
        ...formData,
        userId: userId || formData.userId,
        paymentMethod: paymentDetails.paymentMethod,
        transactionId: paymentDetails.transactionId,
        paymentStatus: paymentDetails.paymentStatus,
        amount: paymentDetails.amount,
      };

      const response = await axios.post(
        "https://ogya.onrender.com/api/order",
        orderData
      );

      if (response.status === 201) {
        setLoading(false);
        navigate("/confirmation", { state: { orderDetails: response.data } });
      }
    } catch (error) {
      console.error("Error recording order details:", error);
      alert("Failed to record order details. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handlePayment} className="billing-form">
  {loading && (
    <div className="loading-overlay">
      <div className="loading-spinner">...</div>
    </div>
  )}
  <div className="billing-data">
    <div className="billing-details">
      <h2>Billing details</h2>
      <label>Full Name *</label>
      <input
        type="text"
        name="fullname"
        value={formData.fullname}
        onChange={handleChange}
        required
        placeholder="John Doe"
      />

      <label>Street Address *</label>
      <input
        type="text"
        name="streetAddress"
        value={formData.streetAddress}
        onChange={handleChange}
        required
        placeholder="123 Main St"
      />

      <label>Town / City *</label>
      <input
        type="text"
        name="townCity"
        value={formData.townCity}
        onChange={handleChange}
        required
        placeholder="City Name"
      />

      <label>State *</label>
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        required
        placeholder="State Name"
      />

      <label>PIN Code *</label>
      <input
        type="text"
        name="pinCode"
        value={formData.pinCode}
        onChange={handleChange}
        required
        placeholder="123456"
      />

      <label>Phone *</label>
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        placeholder="+91 9876543210"
      />

      <label>Email Address *</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="example@email.com"
      />
    </div>

    <div className="order-details">
      <h2>Your order</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <div className="order-summary">
          {cartItems.map((item) => (
            <div key={item.id} className="order-item">
              <div>
                {item.name} × {item.quantity}
              </div>
              <div>₹{item.price * item.quantity}</div>
            </div>
          ))}
          <div className="order-shipping">
            <div>Shipping</div>
            <div>{deliveryCharge > 0 ? "₹" + deliveryCharge : "Free"}</div>
          </div>
          <div className="order-total">
            <div>Total</div>
            <div>₹{totalAmount + deliveryCharge}</div>
          </div>
        </div>
      )}
      <div className="payment-method">
        <h2>Payment Method</h2>
        <div className="payment-option">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={handlePaymentMethodChange}
            disabled
          />
          <label htmlFor="cod">
            <img src={cod} alt="COD" /> Cash on Delivery (not available)
          </label>
        </div>

        <div className="payment-option">
          <input
            type="radio"
            id="razorpay"
            name="paymentMethod"
            value="razorpay"
            checked={paymentMethod === "razorpay"}
            onChange={handlePaymentMethodChange}
          />
          <label htmlFor="razorpay">
            <img src={razorpayimg} alt="Razorpay" /> Pay with Razorpay
          </label>
        </div>

        <button
          type="submit"
          className="place-order-button"
          disabled={loading}
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </div>
  </div>
</form>

      <Footer />
    </>
  );
};

export default Buy;
