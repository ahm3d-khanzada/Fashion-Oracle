import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const features = [
  {
    title: "Virtual Try On",
    description: "Experience clothes virtually before you buy. Our advanced technology allows you to see how outfits look on you without physically trying them on.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mirror%20selfie%20with%20new%20bag-UQF55nw5SGHQQHZ2jVBKFYsMhYRA0J.png"
  },
  {
    title: "Recommendation System",
    description: "Get personalized style suggestions based on your preferences and past purchases. Our AI-powered system learns your taste to provide spot-on recommendations.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/girl%20with%20shopping%20bags-1bZIyfio8Safa6AJYlvdN4Plf1V292.png"
  },
  {
    title: "Cloth Donation",
    description: "Make a difference by donating your gently used clothes. Our platform connects you with local charities and those in need, making the donation process seamless.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/girl%20talking%20on%20phone-Me8aq4xvEAs1yO1DVVvs18ZBX4tAEv.png"
  },
  {
    title: "Community",
    description: "Join our fashion-forward community. Share your style, get inspired by others, and participate in discussions about the latest trends and sustainable fashion practices.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/girl%20meditating-TPJKTr9H9RBE7DfRK7hjuQ87bp99ym.png"
  }
];

const GradientBorder = ({ children, isActive }) => (
  <div className="gradient-border-wrapper">
    <div className={`gradient-border ${isActive ? 'active' : ''}`} />
    {children}
    <div className="ripple-container">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="ripple" />
      ))}
    </div>
  </div>
);

const FeatureImage = ({ src, alt, isActive }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isActive) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 5, repeat: Infinity, repeatType: "reverse" }
      });
    } else {
      controls.stop();
      controls.set({ scale: 1 });
    }
  }, [isActive, controls]);

  return (
    <GradientBorder isActive={isActive}>
      <motion.div
        className="image-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          width: '250px',
          height: '250px',
        }}
      />
    </GradientBorder>
  );
};

export default function EnhancedFeatureShowcase() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef(isAutoPlay);
  const timeoutRef = useRef(null);

  useEffect(() => {
    autoPlayRef.current = isAutoPlay;
  }, [isAutoPlay]);

  useEffect(() => {
    const nextSlide = () => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    };

    const scheduleNextSlide = () => {
      timeoutRef.current = setTimeout(() => {
        if (autoPlayRef.current) {
          nextSlide();
        }
        scheduleNextSlide();
      }, 7000);
    };

    scheduleNextSlide();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDotClick = (index) => {
    setCurrentFeature(index);
    setIsAutoPlay(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  return (
    <Container 
      fluid 
      className="min-vh-100 d-flex flex-column justify-content-center py-5" 
      style={{ background: 'transparent' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style jsx global>{`
        .gradient-border-wrapper {
          position: relative;
          border-radius: 50%;
          padding: 4px;
          background: transparent;
        }
        .gradient-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: linear-gradient(45deg, #34A85A, #FFC107);
          opacity: 0.7;
          z-index: -1;
        }
        .gradient-border.active {
          animation: rotate 8s linear infinite;
        }
        .image-container {
          width: 100%;
          padding-bottom: 100%;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
        }
        .image-container > div {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .ripple-container {
          position: absolute;
          top: -40px;
          left: -40px;
          right: -40px;
          bottom: -40px;
          border-radius: 50%;
          overflow: hidden;
          pointer-events: none;
        }
        .ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(52, 168, 90, 0.4) 0%, rgba(255, 193, 7, 0.4) 100%);
          opacity: 0;
        }
        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          100% {
            width: 250%;
            height: 250%;
            opacity: 0;
          }
        }
        @media (max-width: 768px) {
          .feature-content {
            text-align: center;
            margin-bottom: 2rem;
          }
          .image-container {
            max-width: 300px;
            margin: 0 auto;
          }
        }
        .pagination-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(45deg, #34A85A, #FFC107);
        }
        .pagination-dot.active {
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(52, 168, 90, 0.5);
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <Row className="justify-content-center align-items-center">
        <Col md={10}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="d-flex flex-column flex-md-row align-items-center justify-content-between"
              onAnimationComplete={() => {
                const ripples = document.querySelectorAll('.ripple');
                ripples.forEach((ripple, index) => {
                  ripple.style.animation = `ripple 2s ease-out ${index * 0.3}s`;
                });
              }}
            >
              <motion.div 
                className="feature-content w-100 w-md-50 pe-md-4 mb-4 mb-md-0"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <motion.h2 
                  className="display-4 fw-bold mb-3"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{
                    background: 'linear-gradient(45deg, #34A85A, #FFC107)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {features[currentFeature].title}
                </motion.h2>
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="lead"
                >
                  {features[currentFeature].description}
                </motion.p>
              </motion.div>
              <Col md={5} className="d-flex justify-content-center">
                <FeatureImage
                  src={features[currentFeature].image}
                  alt={features[currentFeature].title}
                  isActive={true}
                />
              </Col>
            </motion.div>
          </AnimatePresence>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col md={6} className="d-flex justify-content-center">
          {features.map((_, index) => (
            <motion.div
              key={index}
              className={`pagination-dot mx-2 ${currentFeature === index ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
              whileHover={{ scale: 1.2 }}
              animate={currentFeature === index ? 
                { 
                  scale: [1, 1.2, 1], 
                  boxShadow: ['0 0 0px rgba(52, 168, 90, 0)', '0 0 10px rgba(52, 168, 90, 0.5)', '0 0 0px rgba(52, 168, 90, 0)'],
                  transition: { 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  } 
                } : {}
              }
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
}