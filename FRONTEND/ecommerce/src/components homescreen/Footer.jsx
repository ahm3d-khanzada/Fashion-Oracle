import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const socialLinks = [
  { 
    icon: <FaFacebookF />, 
    href: 'https://www.facebook.com/share/192mgybui5/', 
    label: 'Facebook',
    color: '#1877F2'
  },
  { 
    icon: <FaInstagram />, 
    href: 'https://www.instagram.com/ahm3d.khanzada?igsh=ZTczbHFwazhyOGJr', 
    label: 'Instagram',
    color: '#E4405F'
  },
  { 
    icon: <FaLinkedinIn />, 
    href: 'https://www.linkedin.com/in/ahmed-khanzada-94987a260?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app ', 
    label: 'LinkedIn',
    color: '#0A66C2'
  },
  { 
    icon: <FaGithub />, 
    href: 'https://github.com/ahm3d-khanzada', 
    label: 'Twitter',
    color: '#1DA1F2'
  },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 relative overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#34A85A] via-[#FFC107] to-[#34A85A] animate-gradient-x" />

      <Container>
        <Row className="align-items-center">
          {/* Logo and Branding */}
          <Col md={3} className="mb-8 mb-md-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="logo-container"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1, type: "spring", stiffness: 260, damping: 20 }}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture-removebg-preview%204-rSiEoHgxfLVdRz0YkedkPV9n0KXn17.png"
                  alt="Fashion Oracle Logo"
                  className="mb-4 w-24 h-24 hover:scale-105 transition-transform"
                />
              </motion.div>
              <motion.p 
                className="mb-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#34A85A] to-[#FFC107] hover:bg-gradient-to-l transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Fashion Oracle
              </motion.p>
              <p className="text-sm text-gray-400">All rights reserved &copy; {new Date().getFullYear()}</p>
            </motion.div>
          </Col>

          {/* Quick Links */}
          <Col md={3} className="mb-8 mb-md-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h5 className="mb-4 text-xl font-semibold text-[#FFC107]">Quick Links</h5>
              <ul className="list-unstyled space-y-2">
                <motion.li whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to="/about" className="text-white hover:text-[#34A85A] transition-colors duration-300">About Us</Link>
                </motion.li>
                <motion.li whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to="/contact" className="text-white hover:text-[#34A85A] transition-colors duration-300">Contact</Link>
                </motion.li>
              </ul>
            </motion.div>
          </Col>

          {/* Contact Info */}
          <Col md={3} className="mb-8 mb-md-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h5 className="mb-4 text-xl font-semibold text-[#FFC107]">Contact Us</h5>
              <motion.p 
                className="mb-3 flex items-center text-gray-300 hover:text-[#34A85A] transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="inline-block mr-2 text-[#34A85A]" size={20} /> fashionorcale3@gmail.com
              </motion.p>
              <motion.p
                className="flex items-center text-gray-300 hover:text-[#34A85A] transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="inline-block mr-2 text-[#34A85A]" size={20} /> +92 (322) 6752378
              </motion.p>
            </motion.div>
          </Col>

          {/* Social Links */}
          <Col md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
<h5 className="mb-4 text-xl font-semibold text-[#FFC107]">Follow Us</h5>
<div className="flex space-x-4">
  {socialLinks.map((social, index) => (
    <motion.a
      key={social.label}
      href={social.href}
      whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
      className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300"
      style={{ color: social.color }}
    >
      {social.icon}
      <span className="sr-only">{social.label}</span>
    </motion.a>
  ))}
</div>

            </motion.div>
          </Col>
        </Row>

        {/* Developer Credit */}
        <Row className="mt-12">
          <Col>
            <motion.p
              className="text-center text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Developed with <span className="heartbeat text-red-500"></span> by Ahmed Khanzada and Ayesha Firdous
            </motion.p>
          </Col>
        </Row>
      </Container>

      {/* Gradient bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFC107] via-[#34A85A] to-[#FFC107] animate-gradient-x" />
    </footer>
  );
};

export default Footer;