// src/data/singleProducts.js

import productImg1 from "../pages/productimage/lavander.png"; // Replace with actual image paths
import productImg2 from "../pages/productimage/rose.png";
import productImg3 from "../pages/productimage/jasmin.png";
import productImg4 from "../pages/productimage/mogra.png";

const singleProducts = [
  {
    id: 4,
    name: 'lavender',
    price: 50,
    description: 'Lavender is Known for its soothing and stress-relieving properties, lavender’s delicate scent calms the mind, making it perfect for relaxation, meditation, or creating a restful atmosphere.',
    images: productImg1
  },
  {
    id: 5,
    name: 'Rose',
    price: 50,
    description: 'Rose is the essence of love and beauty, with its romantic and uplifting aroma. This classic floral scent creates a warm, comforting, and harmonious environment, perfect for moments of peace and reflection.',
    images: productImg2
  },
  {
    id: 6,
    name: 'Jasmine',
    price: 50,
    description: 'The sweet and exotic fragrance of jasmine uplifts your spirits, evoking feelings of positivity and tranquility, ideal for prayer, spiritual rituals, or simply refreshing your home.',
    images: productImg3
  },
  {
    id: 7,
    name: 'Mogra',
    price: 60,
    description: "Immerse yourself in the rich and captivating fragrance of Mogra with our Mogra Natural Agarbatti. Made from the finest mogra flowers and natural ingredients, this incense stick offers a luxurious floral aroma that soothes the senses and uplifts the spirit. Perfect for creating a peaceful and harmonious environment, whether you're meditating, praying, or simply unwinding after a long day.",
    images: productImg4
  }
];

export default singleProducts;
