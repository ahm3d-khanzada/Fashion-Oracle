import React from 'react';

const Marquee = () => {
  const marqueeStyle = {
    background: 'linear-gradient(45deg, #34A85A, #FFC107)',
    color: 'white',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    height: '121px', // Keep this height
    display: 'flex',
    alignItems: 'center', // Vertically center content
    width: '100vw', // Use viewport width for full screen
    position: 'relative', // Ensure it takes the full width
    left: 0,
  };

  const marqueeContentStyle = {
    display: 'inline-block',
    paddingLeft: '0', // Start logos immediately
    animation: 'marquee 50s linear infinite', // Animation for smooth scrolling
  };

  const logoStyle = {
    height: '80px', // Set a fixed height for logos
    margin: '0 60px', // Equal spacing between logos
  };

  // Fashion brand logos with working URLs
  const logos = [
    'https://1000logos.net/wp-content/uploads/2024/07/Nike-Sneaker-Logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png',
    'https://1000logos.net/wp-content/uploads/2022/12/Logo-Ralph-Lauren.png',
    'https://1000logos.net/wp-content/uploads/2016/10/Burberry-Logo.png',
    'https://1000logos.net/wp-content/uploads/2024/07/Vans-Sneaker-Logo.png',
    'https://1000logos.net/wp-content/uploads/2024/07/Gucci-Sneaker-Logo.png',
    'https://1000logos.net/wp-content/uploads/2017/02/HM-Logo.png',
    'https://1000logos.net/wp-content/uploads/2017/12/Gap-Logo.png',
    'https://1000logos.net/wp-content/uploads/2016/11/Coach-logo.png',
    'https://1000logos.net/wp-content/uploads/2017/06/Tommy-Hilfiger-Logo.png',
    'https://1000logos.net/wp-content/uploads/2017/05/Zara-logo.png',
    'https://1000logos.net/wp-content/uploads/2022/06/Logo-Levis.png',
    'https://1000logos.net/wp-content/uploads/2021/04/Under-Armour-logo.png',
    'https://1000logos.net/wp-content/uploads/2016/10/Giorgio-Armani-Logo.png',
    'https://1000logos.net/wp-content/uploads/2024/07/Puma-Sneaker-Logo.png',
    'https://1000logos.net/wp-content/uploads/2017/02/Hermes-Logo.png',
    'https://1000logos.net/wp-content/uploads/2024/07/Fila-Sneaker-Logo.png',
    'https://1000logos.net/wp-content/uploads/2024/07/Air-Jordan-Sneaker-Logo.png',
    'https://1000logos.net/wp-content/uploads/2024/02/Reebok-Logo.png',
    'https://1000logos.net/wp-content/uploads/2016/11/Caterpillar-Logo.png',
    'https://1000logos.net/wp-content/uploads/2021/05/Lacoste-logo.png',

    
  ];

  return (
    <div style={marqueeStyle}>
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translate(0, 0); /* Start from the left */
            }
            100% {
              transform: translate(-100%, 0); /* Scroll to the left */
            }
          }
        `}
      </style>
      <div style={marqueeContentStyle}>
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            style={logoStyle}
          />
        ))}
        {/* Duplicate logos for seamless looping */}
        {logos.map((logo, index) => (
          <img
            key={`duplicate-${index}`}
            src={logo}
            alt={`Logo ${index + 1}`}
            style={logoStyle}
          />
        ))}
      </div>
    </div>
  );
};

export default Marquee;