import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
import logo from 'F:/Connecting (1)/Connecting/FRONTEND/ecommerce/src/assets/logo/Capture-removebg-preview 4.png';
import { Link } from "react-router-dom";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 360,
    transition: {
      duration: 2,
      ease: "easeOut",
      rotate: { repeat: Infinity, duration: 10, ease: "linear" },
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, scale: 1 },
  visible: {
    opacity: 1,
    scale: [1, 1.3, 1],
    transition: { duration: 1, ease: "easeInOut" },
  },
};

const featureColors = {
  "Virtual Try-On": "#34a2eb",
  Recommendation: "#eb8334",
  Community: "#5c34eb",
  Donation: "#ebeb34",
  "Text To Image": "#abeb34"
};

const Hero = () => {
  const controls = useAnimation();
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = ["Virtual Try-On", "Recommendation", "Community", "Donation" , "Text To Image"];

  useEffect(() => {
    const sequence = async () => {
      await controls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await controls.start("hidden");
      setCurrentFeature((prev) => (prev + 1) % features.length);
    };
    sequence();
  }, [currentFeature, controls]);

  return (
    <section className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
      <Container className="text-center">
        <Row>
          <Col>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={logoVariants}
              className="mb-4"
            >
              <img
                src={logo}
                alt="Fashion Logo"
                className="w-16 h-16 mx-auto"
              />
            </motion.div>

            <motion.h1
              className="display-4 font-bold mb-4"
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              Unlock fashion innovation
            </motion.h1>

            <motion.p
              className="h5 mb-4"
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              Experience features like
            </motion.p>

            <motion.div
              className="display-3 font-bold mb-4"
              style={{ minHeight: "60px" }}
            >
              <motion.span
                key={currentFeature}
                initial="hidden"
                animate={controls}
                variants={featureVariants}
                style={{ color: featureColors[features[currentFeature]] }}
              >
                {features[currentFeature]}
              </motion.span>
            </motion.div>

            <motion.p
              className="h5 mb-8"
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              Engage users, fuel creativity, and drive growth in your fashion platform.
            </motion.p>

            <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to={"/community"}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="px-4 py-2 rounded-pill"
                  style={{
                    background: "linear-gradient(45deg, #34A85A, #FFC107)",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Community
                </Button>
              </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="px-4 py-2 bg-white text-dark rounded-pill custom-button"
                  style={{
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;
