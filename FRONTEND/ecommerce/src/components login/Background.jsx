import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Background() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="scroll-container">
        <div className="content">
          <h2>Your Scrollable Content Here</h2>
          <p>More content...</p>
          <p>Even more content...</p>
          {/* Add as much scrollable content as needed */}
        </div>
      </div>
      <div className="background-container">
        <div className="gradient-overlay"></div>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: mousePosition.x + (Math.random() - 0.5) * 200,
              y: mousePosition.y + (Math.random() - 0.5) * 200,
            }}
            transition={{
              duration: 1,
              type: 'spring',
              damping: 15,
              stiffness: 25,
            }}
          />
        ))}
        <motion.div
          className="incave-text-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
        >
          <h1 className="incave-text fashion">Fashion</h1>
          <h1 className="incave-text oracle">Oracle</h1>
        </motion.div>
      </div>

      <style jsx>{`
        .scroll-container {
          position: relative;
          z-index: 1;
          padding: 20px;
          overflow-y: auto;
          height: 100vh;
          scroll-behavior: smooth;
          font-family: sans-serif;
          color: white;
        }
        .content {
          min-height: 200vh;
          padding: 20px;
        }
        .background-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #141415;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
          font-family: GeistSans, "GeistSans Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(40,40,40,0.3) 0%, rgba(20,20,21,0.3) 100%);
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          filter: blur(1px);
        }
        .incave-text-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .incave-text {
          font-size: 15vw;
          font-weight: 900;
          line-height: 0.9;
          color: #141415;
          background-color: #141415;
          -webkit-background-clip: text;
          -moz-background-clip: text;
          background-clip: text;
          text-shadow: 
            0px 1px 2px rgba(255,255,255,0.4),
            0px 2px 4px rgba(255,255,255,0.3),
            0px 4px 8px rgba(255,255,255,0.2),
            0px 8px 16px rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }
        .incave-text.fashion {
          letter-spacing: -0.05em;
        }
        .incave-text.oracle {
          font-size: 18vw;
          letter-spacing: -0.08em;
        }
        .incave-text:hover {
          text-shadow: 
            0px 1px 2px rgba(255,255,255,0.6),
            0px 2px 4px rgba(255,255,255,0.4),
            0px 4px 8px rgba(255,255,255,0.3),
            0px 8px 16px rgba(255,255,255,0.2),
            0px 16px 32px rgba(255,255,255,0.1);
        }
      `}</style>
    </>
  );
}
