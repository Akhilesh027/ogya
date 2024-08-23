import React from 'react';
import './ReviewPage.css';
import prof from './Images/about.jpg'
const testimonials = [
  {
    name: 'Kishore Reddy',
    occupation: 'Corporate Professional',
    image: prof, 
    quote: 'Redefining Millet Meal Options!! Honestly, I have never been a big millet fan until I got introduced to the Fittr Millet Khichdi & Dosa mix. Now, I am totally in love with these products. Ease of cooking and excellent taste makes it a perfect complex carb to add to your meal. Highly recommend them.',
    rating: 5 
  },
  {
    name: 'Nikitha',
    occupation: 'Fashion Designer',
    image: prof, 
    quote: 'I tried the Fittr Millets Masala khichdi mix, it has become my favourite meal on the go. It keeps me full for a long time. It’s nutritious, easy to make, and guilt-free. It tastes good too. I love the product and it’s a must-try!',
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
