// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import BillingPage from './pages/BillingPage';
import Navbar from './pages/Navbar';

import './App.css'
import Products from './pages/product';
import Productshow from './pages/productshow';
import About from './pages/About';
import ContactPage from './pages/Contact';
import Buy from './pages/Buy';
import LoginPage from './pages/Authontication/Login';
import RegistrationPage from './pages/Authontication/Register';
import Checkout from './pages/Billing/Checkout';
import Footer from './pages/footer';
import ProfilePage from './pages/Profile';
import Admin from '../src/admin/Admin'
import ConfirmationPage from './pages/orderConform';
const App = () => {
    return (
        <Router>
          <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/product" element={<Products />} />
                <Route path="/product/:id" element={<Productshow />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/register' element={<RegistrationPage/>}/>
                <Route path="/checkout/*" element={<Checkout />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />

            </Routes>
            <Footer/>
        </Router>
    );
}

export default App;
