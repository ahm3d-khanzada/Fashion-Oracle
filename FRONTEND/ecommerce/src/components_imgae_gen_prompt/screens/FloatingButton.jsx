"use client"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const FloatingButton = () => {
  return (
    <motion.div
      className="floating-button"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="tooltip"
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        Generate clothes by your own choice
      </motion.div>
      <Link to="/image_gen">
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 8px 20px rgba(52, 168, 90, 0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-tshirt"></i>
        </motion.button>
      </Link>
      <style jsx>{`
        .floating-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }
        
        .floating-button button {
          background: linear-gradient(135deg, #34A85A, #2c8f4c);
          color: white;
          border: none;
          border-radius: 50%;
          width: 65px;
          height: 65px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
          box-shadow: 0 6px 16px rgba(52, 168, 90, 0.3);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .floating-button button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
          border-radius: 50%;
        }
        
        .tooltip {
          position: absolute;
          bottom: 75px;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          font-size: 0.9rem;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(4px);
        }
        
        .tooltip::after {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 25px;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid rgba(0, 0, 0, 0.8);
        }
        
        @media (max-width: 768px) {
          .floating-button {
            bottom: 1.5rem;
            right: 1.5rem;
          }
          
          .floating-button button {
            width: 55px;
            height: 55px;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default FloatingButton