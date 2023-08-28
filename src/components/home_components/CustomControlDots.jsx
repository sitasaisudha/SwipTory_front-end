import React from "react";
import './CustomDotsStyles.css'
const CustomControlDots = ({ totalSlides, currentSlide }) => {
    const dots = [];
  
    for (let i = 0; i < totalSlides; i++) {
      dots.push(
        <div
          key={i}
          className={`custom-dot ${i === currentSlide ? 'active' : ''}`}
         
        />
      );
    }
  
    return <div className="custom-control-dots">{dots}</div>;
  };
  
  export default CustomControlDots;