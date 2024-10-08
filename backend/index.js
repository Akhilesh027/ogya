const express = require('express');
const path = require('path');
const cors = require('cors');
const Product = require('./Module/Product');
const sequelize = require('./Database/db');
const multer = require('multer');
const Order = require('./Module/order');
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
// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).send('Error uploading file.');
    }
    res.send('File uploaded successfully.');
  });
});

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
      from: 'ogya034@gmail@gmail.com', // Replace with your email
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

// Registration route
app.post('/register', async (req, res) => {
  const { firstName, lastName, mobileNo, email, password, username } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = await User.create({
      firstName,
      lastName,
      mobileNo,
      email,
      password: hashedPassword,
      username
    });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'BANNU9', { expiresIn: '1h' });

    // Send the token, role, and userId to the frontend
    res.json({ token, role: user.role, userId: user.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});


// Protecting routes: Example middleware for checking token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send({ message: 'Failed to authenticate token.' });
    req.userId = decoded.userId; // Save user ID for use in other routes
    next();
  });
};
app.get('/users/:id', async (req, res) => {
  try {
      const userId = req.id; // Get user ID from request parameters

      // Fetch user from the database using Sequelize
      const user = await User.findByPk(userId);
    console.log(userId)
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Respond with user details
      res.json({
          id: user.userId, // Adjust based on your model
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          mobileNo: user.mobileNo,
      });
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user details
app.get('/me', async (req, res) => {
  try {
    // Ensure req.user contains userId
    const userId = 1; // Adjust if necessary
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user.userId, // Adjust based on your model
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNo: user.mobileNo
    });
  } catch (error) {
    console.error('Error fetching user details:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to handle product creation with image upload
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
    const totalOrders = await BillingDetails.count();
    res.json({ totalOrders });
  } catch (error) {
    console.error('Error fetching total orders:', error);
    res.status(500).json({ error: 'Error fetching total orders' });
  }
});

// Route to get total amount generated
app.get('/api/totalAmount', async (req, res) => {
  try {
    const totalAmount = await BillingDetails.sum('amount');
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
        user: 'ogya034@gmail@gmail.com', // Replace with your email
        pass: 'oxyl xyfs qako bldv', // Replace with your email password
      },
    });

    let mailOptions = {
      from: 'ogya034@gmail@gmail.com', // Replace with your email
      to: 'ogya034@gmail@gmail.com', // Replace with admin's email
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

app.post('/api/billing', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      country,
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
    } = req.body;

    const billingDetails = await BillingDetails.create({
      firstName,
      lastName,
      country,
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

    // Send email to the user
    await sendEmail(
      email,
      'Billing Successful',
      `Dear ${firstName},\n\nYour payment of ₹${amount} was successful. Thank you for your purchase!\n\nTransaction ID: ${transactionId}\nPayment Method: ${paymentMethod}\n\nBest regards,\nYour Company Name`
    );

    // Send email notification to the admin
    await sendAdminNotification(firstName, amount, transactionId);

    res.status(201).json(billingDetails);
  } catch (error) {
    console.error('Error saving billing details:', error);
    res.status(500).json({ error: 'Failed to save billing details' });
  }
});

app.get('/api/billing', async (req, res) => {
  try {
    const billingDetails = await BillingDetails.findAll();
    res.status(200).json(billingDetails);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching billing details' });
  }
});
app.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      const order = await BillingDetails.findByPk(id);

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

      await sendEmail('ogya034@gmail@gmail.com', subject, text);

      res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Failed to update order status' });
  }
});

app.delete('/api/billing/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const order = await BillingDetails.findByPk(id);
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
    
    await sendEmail('ogya034@gmail@gmail.com', subject, text);

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
