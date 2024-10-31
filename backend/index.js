const express = require('express');
const path = require('path');
const cors = require('cors');
const Product = require('./Module/Product');
const sequelize = require('./Database/db');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Cart = require('./Module/Cart');
const BillingDetails = require('./Module/Billing');
const nodemailer = require('nodemailer'); // Import NodeMailer
const User = require('./Module/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Contact } = require('./Module/Contact');
const app = express();
const port = 5000;
const fs = require('fs');
const ComboOffer = require('./Module/OfferCombo');
const { off } = require('process');
const Razorpay = require('razorpay')
const crypto = require('crypto'); // Make sure to import crypto if you haven't already
const Order = require('./Module/order');
const Payment = require('./Module/order');
const Post = require('./Module/post');
const comboOffer = require('./Module/OfferCombo');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Sync Sequelize models with the database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));


  app.use(cors());
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'BANNU9', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Make sure 'user' contains 'userId'
    next();
  });
};
const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ogya034@gmail.com', // Replace with your email
        pass: 'cruc jcey fqjy yqmd', // Replace with your email password
      },
    });

    let mailOptions = {
      from: 'ogya034@gmail.com', // Replace with your email
      to: to,
      subject: subject,
      text: text,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const JWT_SECRET = process.env.JWT_SECRET || 'BANNU9';
app.post("/api/posts", upload.single("image"), async (req, res) => {
  const { name, price, description } = req.body;

  try {
      const newPost = await Product.create({
          name,
          price,
          description,
          images: req.file ? `${req.file.filename}` : ""
      });
      res.json(newPost);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
app.post("/api/comboposts", upload.single("image"), async (req, res) => {
  const { name, price, description } = req.body;

  try {
      const newPost = await comboOffer.create({
          name,
          price,
          description,
          images: req.file ? `${req.file.filename}` : ""
      });
      res.json(newPost);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, mobileNo, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = await User.create({
      firstName,
      lastName,
      mobileNo,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' }); // Updated for clarity
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' }); // Updated for clarity
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, 'bannu9', { expiresIn: '1h' });

    res.json({ token, email: user.email, userId: user.userId });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});


// Protecting routes: Example middleware for checking token
// Verify token middleware for protected routes
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, 'bannu9', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.userId; // Save user ID for use in other routes
    next();
  });
};

app.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // Extracted from token

    // Fetch user from the database using Sequelize
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Destructure user fields
    const { userId: id, email, firstName, lastName, mobileNo } = user;

    // Respond with user details
    return res.status(200).json({ id, email, firstName, lastName, mobileNo });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/products', upload.array('images', 10), async (req, res) => {
  const { name, price, description } = req.body;
  const images = req.files.map(file => `${file.filename}`);

  try {
    // Assuming Product is a Mongoose model or similar ORM
    const newProduct = await Product.create({
      name,
      price,
      description,
      images: JSON.stringify(images)
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: 'Error uploading product' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const [cartItem, created] = await Cart.findOrCreate({
      where: { productId },
      defaults: { quantity }
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ error: 'Error adding item to cart' });
  }
});

app.get('/cart', async (req, res) => {
  try {
    const cartItems = await Cart.findAll({ include: ['Product'] });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching cart items' });
  }
});

app.delete('/remove/:productId', async (req, res) => {
  try {
    await Cart.destroy({ where: { productId: req.params.productId } });
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(400).json({ error: 'Error removing item from cart' });
  }
});

app.post('/api/order', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save order information' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.findAll(); 
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Route to get total orders
app.get('/api/totalOrders', async (req, res) => {
  try {
    const totalOrders = await Order.count();
    res.json({ totalOrders });
  } catch (error) {
    console.error('Error fetching total orders:', error);
    res.status(500).json({ error: 'Error fetching total orders' });
  }
});

// Route to get total amount generated
app.get('/api/totalAmount', async (req, res) => {
  try {
    const totalAmount = await Order.sum('amount');
    res.json({ totalAmount });
  } catch (error) {
    console.error('Error fetching total amount:', error);
    res.status(500).json({ error: 'Error fetching total amount' });
  }
});

// Update a product by ID
app.put('/api/products/:id', upload.array('images', 10), async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  const images = req.files.map(file => `/uploads/${file.filename}`);

  try {
    const product = await Product.findByPk(id);
    if (product) {
      await product.update({
        name,
        price,
        description,
        images: JSON.stringify(images)
      });
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cartItem = await Cart.create({ productId, quantity });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await Cart.findAll();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items' });
  }
});

const sendAdminNotification = async (firstName, amount, transactionId) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ogya034@gmail.com', // Replace with your email
        pass: 'oxyl xyfs qako bldv', // Replace with your email password
      },
    });

    let mailOptions = {
      from: 'ogya034@gmail.com', // Replace with your email
      to: 'ogya034@gmail.com', // Replace with admin's email
      subject: 'New Payment Received',
      text: `A new payment has been received:
             Name: ${firstName}
             Amount: ₹${amount}
             Transaction ID: ${transactionId}`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent: ' + info.response);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};


// Get orders by userId
app.get('/api/orders/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.findAll({ where: { userId } });
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Error fetching orders' });
    }
});

const razorpayInstance = new Razorpay({
  key_id: 'rzp_live_qO97ytpJFY75xi', // Replace with your Razorpay key ID
  key_secret: 'p6xSK9DBrJ8bOhASfmpFi2OA', // Replace with your Razorpay key secret
});
// Create a new order
app.post('/api/order', async (req, res) => {
  try {
      const { userId,fullname, streetAddress, townCity, state, pinCode, phone, email, paymentMethod, transactionId, paymentStatus, amount } = req.body;

      const newOrder = await Order.create({
          userId,
          fullname,
          streetAddress,
          townCity,
          state,
          pinCode,
          phone,
          email,
          paymentMethod,
          transactionId,
          paymentStatus,
          amount
      });
      await sendAdminNotification(firstName, amount, transactionId || 'N/A');

      return res.status(201).json(newOrder);
  } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ error: 'Error creating order' });
  }
});

// Create an order for Razorpay payment
app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body; // Amount in paise

  // Create Razorpay order
  const options = {
      amount, // Amount in paise
      currency: 'INR',
      receipt: 'receipt#1',
  };

  try {
      const response = await razorpayInstance.orders.create(options);
      return res.status(200).json({
          orderId: response.id,
          amount: response.amount,
          currency: response.currency,
      });
  } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return res.status(500).json({ error: 'Error creating order' });
  }
});

// Verify Razorpay payment
app.post('/api/payment/verify', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const expectedSignature = crypto.createHmac('sha256', 'p6xSK9DBrJ8bOhASfmpFi2OA')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

  if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ message: 'Payment verification successful' });
  } else {
      return res.status(400).json({ message: 'Payment verification failed' });
  }
});

// Billing route
// app.post('/api/billing', async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       country,
//       streetAddress,
//       townCity,
//       state,
//       pinCode,
//       phone,
//       paymentMethod,
//       email,
//       amount, // Amount should be in paise
//     } = req.body;

//     // Create a Razorpay order
//     const options = {
//       amount: amount * 100, // Convert amount to paise (100 paise = 1 INR)
//       currency: 'INR',
//       receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
//     };

//     const order = await razorpayInstance.orders.create(options);

//     // Prepare billing details for storage
//     const billingDetails = {
//       firstName,
//       lastName,
//       country,
//       streetAddress,
//       townCity,
//       state,
//       pinCode,
//       phone,
//       email,
//       paymentMethod, // Explicitly set payment method if applicable
//       transactionId: order.id, // Store Razorpay order ID here
//       paymentStatus: 'Pending', // Set initial status as pending
//       amount: order.amount, // Store amount from order creation
//     };

//     // Save billing details to the database
//     await BillingDetails.create(billingDetails);

//     // Send the order ID back to the frontend
//     res.status(201).json({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       billingDetails, // Optional: send billing details if needed
//     });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ error: 'Failed to create order' });
//   }
// });


// // Verify payment route
// app.post('/api/payment/verify', (req, res) => {
//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

//   // Verify the signature using the secret key
//   const body = razorpay_order_id + '|' + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac('sha256', 'p6xSK9DBrJ8bOhASfmpFi2OA') // Use your actual Razorpay secret key
//     .update(body.toString())
//     .digest('hex');

//   if (expectedSignature === razorpay_signature) {
//     // Update billing status to successful in the database
//     BillingDetails.update(
//       { paymentStatus: 'Successful', transactionId: razorpay_payment_id }, // Update transaction ID
//       { where: { transactionId: razorpay_order_id } } // Match with order ID
//     )
//       .then(() => {
//         res.status(200).json({ message: 'Payment verification successful' });
//       })
//       .catch((error) => {
//         console.error('Error updating billing details:', error);
//         res.status(500).json({ error: 'Failed to update billing details' });
//       });
//   } else {
//     res.status(400).json({ error: 'Payment verification failed' });
//   }
// });



app.get('/api/billing', async (req, res) => {
  try {
    const billingDetails = await Order.findAll();
    res.status(200).json(billingDetails);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching billing details' });
  }
});
app.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      const order = await Order.findByPk(id);

      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Update the order status
      order.paymentStatus = status;
      await order.save();

      // Send notification email using the existing sendEmail function
      const subject = `Order #${id} Status Update`;
      const text = `Dear Customer,

Your order with ID: ${id} has been updated to the following status: ${status}.

If you have any questions or need further assistance, please feel free to contact us.

Thank you for shopping with us!

Best regards,
Your Company Name
Phone Number: [Your Contact Number]
Email: [Your Company Email]`;

      await sendEmail('ogya034@gmail.com', subject, text);

      res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Failed to update order status' });
  }
});

app.delete('/api/billing/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const order = await Order.findByPk(id);
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      await order.destroy();
      return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
      console.error('Error deleting order:', error);
      return res.status(500).json({ message: 'An error occurred while deleting the order' });
  }
});
app.post('/api/contact', async (req, res) => {
  const { name, email, phonenumber } = req.body;
  
  try {
    // Save contact details to the database
    await Contact.create({ name, email, phonenumber });
    
    // Send notification email using the existing sendEmail function
    const subject = "New Contact Message";
    const text = `You have a new contact message from:
                  Name: ${name}
                  Email: ${email}
                  Phone Number: ${phonenumber}`;
    
    await sendEmail('ogya034@gmail.com', subject, text);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

app.post('/api/offers', upload.array('images', 10), async (req, res) => {
  const { name, price, description } = req.body;
  const images = req.files.map(file => `${file.filename}`);

  try {
    // Assuming Product is a Mongoose model or similar ORM
    const newProduct = await ComboOffer.create({
      name,
      price,
      description,
      images: JSON.stringify(images)
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: 'Error uploading product' });
  }
});

app.get('/api/offer', async (req, res) => {
  try {
    const products = await ComboOffer.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.get('/api/offers/:id', async (req, res) => {
  try {
    const product = await ComboOffer.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
