import axios from 'axios';
import { useState } from 'react';

function BillingPage() {
  const [billingDetails, setBillingDetails] = useState({
    orderId: '',
    customerName: '',
    customerAddress: '',
    city: '',
    pincode: '',
    items: [{ name: '', quantity: 0 }],
    totalAmount: 0, // Total amount for the order
    paymentMethod: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('item')) {
      const index = parseInt(name.split('-')[1]);
      const newItems = [...billingDetails.items];
      newItems[index] = { ...newItems[index], [name.split('-')[0]]: value };
      setBillingDetails({ ...billingDetails, items: newItems });
    } else {
      setBillingDetails({ ...billingDetails, [name]: value });
    }
  };

  const addItem = () => {
    setBillingDetails((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 0 }]
    }));
  };

  const calculateTotal = () => {
    const total = billingDetails.items.reduce((sum, item) => {
      return sum + (item.quantity * 100); // Assuming each item costs 100; replace with actual logic
    }, 0);
    setBillingDetails((prev) => ({ ...prev, totalAmount: total }));
  };

  const processPayment = async () => {
    try {
      const response = await axios.post('/api/process-payment', billingDetails);
      console.log('Payment processed:', response.data);
      setMessage('Payment processed successfully!');
      setError('');
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Error processing payment. Please try again.');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Billing Page</h2>
      <form>
        <div>
          <label>Order ID:</label>
          <input
            type="text"
            name="orderId"
            value={billingDetails.orderId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            name="customerName"
            value={billingDetails.customerName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Customer Address:</label>
          <input
            type="text"
            name="customerAddress"
            value={billingDetails.customerAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={billingDetails.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pincode:</label>
          <input
            type="text"
            name="pincode"
            value={billingDetails.pincode}
            onChange={handleChange}
            required
          />
        </div>
        <h3>Items:</h3>
        {billingDetails.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              name={`item-name-${index}`}
              placeholder="Item Name"
              value={item.name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name={`item-quantity-${index}`}
              placeholder="Quantity"
              value={item.quantity}
              onChange={handleChange}
              required
              min="1"
              onBlur={calculateTotal} // Calculate total when quantity changes
            />
          </div>
        ))}
        <button type="button" onClick={addItem}>Add More Items</button>
        
        <div>
          <h3>Total Amount: ₹{billingDetails.totalAmount}</h3>
        </div>

        <div>
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={billingDetails.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="upi">UPI</option>
            <option value="net_banking">Net Banking</option>
          </select>
        </div>
        
        <button type="button" onClick={processPayment}>Process Payment</button>
      </form>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default BillingPage;
