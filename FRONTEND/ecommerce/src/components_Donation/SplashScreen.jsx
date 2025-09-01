"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
`

const ColorfulText = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const ColorSpan = styled.span`
  display: inline-block;
  background: ${(props) => props.gradient || "white"};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding: 0 5px;
`

const ColorfulCircle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: ${(props) => props.color};
  opacity: 0.7;
  filter: blur(20px);
`

const SplashScreen = ({ onComplete }) => {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
      setTimeout(() => {
        if (onComplete) {
          onComplete()
        }
      }, 1000) // Allow exit animation to complete
    }, 5000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const circles = [
    { color: "#FF5555", size: "200px", x: "10%", y: "20%", delay: 0 },
    { color: "#FFC107", size: "250px", x: "60%", y: "60%", delay: 0.2 },
    { color: "#34A85A", size: "180px", x: "75%", y: "30%", delay: 0.4 },
    { color: "#5555FF", size: "220px", x: "30%", y: "70%", delay: 0.6 },
    { color: "#AA44AA", size: "150px", x: "40%", y: "20%", delay: 0.8 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 1 },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 1,
      },
    },
  }

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom) => ({
      scale: 1,
      opacity: 0.7,
      transition: {
        duration: 1.5,
        delay: custom,
        ease: "easeOut",
      },
    }),
    float: (custom) => ({
      y: [0, -20, 0],
      x: [0, 10, 0],
      transition: {
        duration: 5,
        delay: custom,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    }),
  }

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
          <SplashContainer>
            {circles.map((circle, index) => (
              <ColorfulCircle
                key={index}
                color={circle.color}
                style={{
                  width: circle.size,
                  height: circle.size,
                  left: circle.x,
                  top: circle.y,
                }}
                variants={circleVariants}
                custom={circle.delay}
                initial="hidden"
                animate={["visible", "float"]}
              />
            ))}

            <ColorfulText variants={textVariants} initial="hidden" animate="visible">
              Add <ColorSpan gradient="linear-gradient(to right, #FF5555, #FFC107)">colors</ColorSpan> in
              <br />
              someone's <ColorSpan gradient="linear-gradient(to right, #34A85A, #5555FF)">life</ColorSpan>
            </ColorfulText>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                transition: {
                  duration: 2,
                  repeat: 1,
                  repeatType: "reverse",
                  delay: 2,
                },
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14"></path>
                <path d="M19 12l-7 7-7-7"></path>
              </svg>
            </motion.div>
          </SplashContainer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen

