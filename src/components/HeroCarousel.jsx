import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';

import img2 from '../assets/BGMI.png';
import img3 from '../assets/FreeFire.png';
import img4 from '../assets/VALORENT.png';
import img5 from '../assets/Stumble guys.png';

const slides = [
  { id: 1, image: img2, title: 'Battlegrounds Mobile India', subtitle: 'Dominate the Battle Royale' },
  { id: 2, image: img3, title: 'Garena Free Fire', subtitle: 'Survival of the Fittest' },
  { id: 3, image: img4, title: 'Valorant', subtitle: 'Defy the Limits' },
  { id: 4, image: img5, title: 'Stumble Guys', subtitle: 'Fun and Chaotic Racing' },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="hero-carousel">
      <div 
        className="hero-carousel-track" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className="hero-slide"
            style={{ backgroundImage: `url("${slide.image}")` }}
          />
        ))}
      </div>

      <button className="hero-arrow left-arrow" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="hero-arrow right-arrow" onClick={nextSlide}>
        &#10095;
      </button>

      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
