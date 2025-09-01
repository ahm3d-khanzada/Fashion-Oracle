"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import SplashScreen from "../SplashScreen"
import ScrollDownButton from "../ScrollDownButton"

const PageContainer = styled.div`
  position: relative;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
`

const Section = styled.section`
  scroll-snap-align: start;
  height: 100vh;
  width: 100%;
`

const GradientBackground = styled(Section)`
  background: linear-gradient(to right, #34A85A, #FFC107);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
`

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(52, 168, 90, 0.85), rgba(255, 193, 7, 0.85));
  z-index: 1;
`

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ContentContainer = styled(motion.div)`
  position: relative;
  z-index: 2;
  max-width: 800px;
`

const Title = styled(motion.h1)`
  color: white;
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const Subtitle = styled(motion.p)`
  color: white;
  font-size: 1.2rem;
  max-width: 800px;
  margin-bottom: 40px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`

const ButtonContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`

const DonateButton = styled(motion.button)`
  background-color: #34A85A;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`

const DoneeButton = styled(motion.button)`
  background-color: #FFC107;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`

const FloatingShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`

const FloatingShape = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: ${(props) => props.color};
  opacity: 0.2;
  filter: blur(40px);
`

const Donation_Home = () => {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  }

  const shapes = [
    { color: "rgba(255, 255, 255, 0.3)", size: "300px", x: "10%", y: "20%", delay: 0 },
    { color: "rgba(255, 255, 255, 0.2)", size: "200px", x: "70%", y: "15%", delay: 0.5 },
    { color: "rgba(255, 255, 255, 0.25)", size: "250px", x: "80%", y: "60%", delay: 1 },
    { color: "rgba(255, 255, 255, 0.15)", size: "180px", x: "20%", y: "70%", delay: 1.5 },
  ]

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <AnimatePresence>
        {!showSplash && (
          <PageContainer>
            <GradientBackground id="main-content">
              <VideoBackground autoPlay muted loop>
                <source src="/placeholder.svg" type="video/mp4" />
              </VideoBackground>
              <VideoOverlay />

              <FloatingShapes>
                {shapes.map((shape, index) => (
                  <FloatingShape
                    key={index}
                    color={shape.color}
                    style={{
                      width: shape.size,
                      height: shape.size,
                      left: shape.x,
                      top: shape.y,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 0.2,
                      y: [0, -30, 0],
                      x: [0, 15, 0],
                      transition: {
                        delay: shape.delay,
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                    }}
                  />
                ))}
              </FloatingShapes>

              <ContentContainer variants={containerVariants} initial="hidden" animate="visible">
                <Title variants={itemVariants}>Share Warmth, Share Hope</Title>

                <Subtitle variants={itemVariants}>
                  Connect with those in need through clothing donations. Your unused clothes can make a significant
                  difference in someone's life.
                </Subtitle>

                <ButtonContainer variants={itemVariants}>
                  <Link to="/donation/donor">
                    <DonateButton variants={buttonVariants} whileHover="hover" whileTap="tap">
                      Donate
                    </DonateButton>
                  </Link>

                  <Link to="/donation/donee">
                    <DoneeButton variants={buttonVariants} whileHover="hover" whileTap="tap">
                      Donee/Recipient
                    </DoneeButton>
                  </Link>
                </ButtonContainer>
              </ContentContainer>

              <ScrollDownButton targetId="about-section" />
            </GradientBackground>

            <Section id="about-section" style={{ backgroundColor: "white", padding: "40px" }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
              >
                <h2 style={{ fontSize: "2.5rem", marginBottom: "30px", color: "#333" }}>About Our Donation Program</h2>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", marginBottom: "30px", color: "#555" }}>
                  Our clothing donation program connects donors with those in need, creating a community of sharing and
                  support. Whether you have gently used clothes to donate or are in need of clothing assistance, our
                  platform makes it easy to give and receive with dignity and respect.
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "30px",
                    flexWrap: "wrap",
                    marginTop: "50px",
                  }}
                >
                  <motion.div whileHover={{ y: -10 }} style={{ maxWidth: "300px", padding: "20px" }}>
                    <div style={{ fontSize: "3rem", color: "#34A85A", marginBottom: "15px" }}>
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#333" }}>Make a Difference</h3>
                    <p style={{ color: "#666" }}>
                      Your donations directly help individuals and families in need within your community.
                    </p>
                  </motion.div>

                  <motion.div whileHover={{ y: -10 }} style={{ maxWidth: "300px", padding: "20px" }}>
                    <div style={{ fontSize: "3rem", color: "#FFC107", marginBottom: "15px" }}>
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#333" }}>Easy Process</h3>
                    <p style={{ color: "#666" }}>
                      Our platform makes donating and requesting items simple and straightforward.
                    </p>
                  </motion.div>

                  <motion.div whileHover={{ y: -10 }} style={{ maxWidth: "300px", padding: "20px" }}>
                    <div style={{ fontSize: "3rem", color: "#FF5555", marginBottom: "15px" }}>
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#333" }}>Community Building</h3>
                    <p style={{ color: "#666" }}>
                      Connect with others in your area and build a stronger, more supportive community.
                    </p>
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ marginTop: "50px" }}>
                  <Link to="/donation/donor" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        background: "linear-gradient(to right, #34A85A, #FFC107)",
                        color: "white",
                        border: "none",
                        borderRadius: "30px",
                        padding: "15px 40px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      Start Donating Now
                    </button>
                  </Link>
                </motion.div>
              </motion.div>
            </Section>
          </PageContainer>
        )}
      </AnimatePresence>
    </>
  )
}

export default Donation_Home

