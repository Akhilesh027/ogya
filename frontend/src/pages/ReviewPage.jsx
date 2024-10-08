import React from 'react';
import './ReviewPage.css';
import prof from './Images/about.jpg'
const testimonials = [
  {
    name: 'Kishore Reddy',
    occupation: 'Corporate Professional',
    image: prof, 
    quote: 'The Ogya Agarabathi incense sticks are a perfect blend of tradition and soothing fragrance, crafted to elevate your environment with natural, calming aromas. Each stick is made from high-quality ingredients, ensuring a long-lasting burn time with minimal smoke, making it ideal for meditation, prayer, or simply refreshing your space.',
    rating: 5 
  },
  {
    name: 'Nikitha',
    occupation: 'Fashion Designer',
    image: prof, 
    quote: "Ogya Agarabathi incense sticks offer a premium experience at an affordable price. Whether you're using them for spiritual purposes or to simply enjoy a fragrant home, Ogya Agarabathi delivers on quality, fragrance, and overall satisfaction.",
    rating: 4 
  }
];

const ReviewPage = () => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <div className="review-page">
      <h2 className="review-heading">What Our Customers Are Saying</h2>
      <p className="review-intro">
        Our customers love our products and their reviews speak for themselves. Here’s what they have to say about their experience with our millet-based meals.
      </p>
      
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial">
            <p className="quote">"{testimonial.quote}"</p>
            <div className="profile">
              <img src={testimonial.image} alt={testimonial.name} className="profile-img" />
              <div className="profile-info">
                <h4 className="name">{testimonial.name}</h4>
                <p className="occupation">{testimonial.occupation}</p>
                <div className="rating">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
