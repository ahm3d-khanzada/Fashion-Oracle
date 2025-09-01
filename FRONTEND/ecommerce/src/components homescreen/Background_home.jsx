import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Container } from 'react-bootstrap';

const BackgroundHome = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <Container fluid className="bg-[#0f0f10] overflow-hidden p-0 m-0">
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: GeistSans, "GeistSans Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          background-color: #0f0f10;
          color: white;
          cursor: none; /* Remove default cursor */
          overflow: auto; /* Allow scrolling */
        }
      `}</style>

      <motion.div
        className="custom-cursor"
        style={{
          position: 'fixed',
          left: mouseXSpring,
          top: mouseYSpring,
          width: '20px',
          height: '20px',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="url(#gradient)"
            strokeWidth="2"
            opacity="0.8"
          />
          <circle cx="10" cy="10" r="2" fill="white" />
          <defs>
            <linearGradient
              id="gradient"
              x1="0"
              y1="0"
              x2="20"
              y2="20"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#34A85A" />
              <stop offset="1" stopColor="#FFC107" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </Container>
  );
}

export default BackgroundHome;
