import React, { useState, useEffect } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {  useSelector } from "react-redux";

const BASE_URL = "http://localhost:8000"; // 🔁 Adjust this in production

const Community_Sidebar = () => {
  const [notifications, setNotifications] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

    const { userInfo } = useSelector((state) => state.userSignin);
    const username = userInfo?.username || "User";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Home', path: '/community', icon: 'fa-home', label: 'Home' },
    { name: 'Search', path: '/community/search', icon: 'fa-search', label: 'Search' },
    { name: 'Notifications', path: '/community/notifications', icon: 'fa-bell', label: 'Notifications' },
    { name: 'Create', path: '/community/create', icon: 'fa-plus-square', label: 'Create' },
    { name: 'Profile', path: '/community/profile', icon: 'fa-user', label: 'Profile' },
  ];
const dummyPost = {
  id: "dummy1",
  username: "john_doe",
  profile_pic:
    "http://localhost:8000/media/profile_pic/default.png",
  image:
    "https://images.unsplash.com/photo-1567013514336-6de53c9e7e63?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdCUyMHdvbWFufGVufDB8fDB8fHww",
  likes: 123,
  caption: "This is a dummy post caption.",
  comments: [
    { id: "1", username: "jane_doe", text: "Nice post!" },
    { id: "2", username: "alice", text: "Great content!" },
  ],
  isLiked: false,
  isVerified: true,
};
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

    const profilePicURL = userInfo?.profile_pic
    ? userInfo.profile_pic.startsWith("http")
      ? userInfo.profile_pic
      : `${BASE_URL}${userInfo.profile_pic}`
    : dummyPost.profile_pic;

  return (
    <AnimatePresence>
      {isMobile ? 
               <Navbar fixed="bottom" style={{ background: '#000000', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} className="justify-content-around">
                 {navItems.map((item) => (
                   <motion.div
                     key={item.name}
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                   >
                     <Nav.Link
                       as={Link}
                       to={item.path}
                       className={`text-center ${
                         location.pathname === item.path ? 'text-warning' : 'text-white'
                       }`}
                     >
                       <div className="position-relative">
                         <i className={`fas ${item.icon}`} style={{ fontSize: '1.5rem' }}></i>
                         {item.name === 'Notifications' && notifications > 0 && (
                           <motion.span
                             className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                             style={{ 
                               background: '#FFC107', 
                               color: '#000000',
                               fontSize: '0.6rem',
                               padding: '0.25em 0.4em',
                               transform: 'translate(-50%, -50%)'
                             }}
                             initial={{ scale: 0 }}
                             animate={{ scale: 1 }}
                             transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                           >
                             {notifications}
                           </motion.span>
                         )}
                       </div>
                       {item.name === 'Profile' && (
                         <motion.img
                           src={profilePicURL}
                           alt="Profile"
                           className="rounded-circle mt-1"
                           width="24"
                           height="24"
                           whileHover={{ scale: 1.2 }}
                         />
                       )}
                     </Nav.Link>
                   </motion.div>
                 ))}
               </Navbar>
              : 
               <motion.div
                 className="sidebar"
                 initial="closed"
                 animate="open"
                 exit="closed"
                 variants={sidebarVariants}
                 transition={{ duration: 0.3 }}
                 style={{
                   position: 'fixed',
                   left: 0,
                   top: 0,
                   bottom: 0,
                   width: '280px',
                   padding: '1.5rem',
                   background: '#000000',
                   color: '#ffffff',
                   zIndex: 1000,
                   borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                   display: 'flex',
                   flexDirection: 'column',
                 }}
               >
                 <motion.div
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mb-5 text-center"
                 >
                   <motion.img
                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture-removebg-preview%204-5g3X3mlK9FnO8E26k0qenRMst4LvYr.png"
                     alt="Fashion Oracle Logo"
                     className="mb-3"
                     style={{ width: '80px', height: '80px' }}
                     whileHover={{ rotate: 360, scale: 1.1 }}
                     transition={{ duration: 0.8, type: "spring" }}
                   />
                   <motion.h4
                     className="text-white mb-0"
                     style={{ 
                       background: 'linear-gradient(to right, #34A85A, #FFC107)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent'
                     }}
                     whileHover={{ scale: 1.05 }}
                   >
                     Fashion Oracle
                   </motion.h4>
                 </motion.div>
       
                 <div className="mb-4" style={{ height: '1px', background: 'linear-gradient(to right, #34A85A, #FFC107)' }} />
       
                 <Nav className="flex-column flex-grow-1">
                   {navItems.map((item, index) => (
                     <motion.div
                       key={item.name}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: index * 0.1 }}
                     >
                       <Nav.Link
                         as={Link}
                         to={item.path}
                         className={`d-flex align-items-center mb-4 text-white ${
                           location.pathname === item.path ? 'active' : ''
                         }`}
                       >
                         <motion.div
                           whileHover={{ scale: 1.05, x: 10 }}
                           whileTap={{ scale: 0.95 }}
                           className="d-flex align-items-center w-100"
                           style={{
                             background: location.pathname === item.path ? 'linear-gradient(45deg, rgba(52, 168, 90, 0.1), rgba(255, 193, 7, 0.1))' : 'transparent',
                             padding: '0.5rem 1rem',
                             borderRadius: '8px'
                           }}
                         >
                           <div className="position-relative">
                             <i className={`fas ${item.icon}`} style={{ fontSize: '1.2rem' }}></i>
                             {item.name === 'Notifications' && notifications > 0 && (
                               <motion.span
                                 className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                 style={{ 
                                   background: '#FFC107', 
                                   color: '#000000', 
                                   fontSize: '0.6rem',
                                   padding: '0.25em 0.4em',
                                   transform: 'translate(-50%, -50%)'
                                 }}
                                 initial={{ scale: 0 }}
                                 animate={{ scale: 1 }}
                                 transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                               >
                                 {notifications}
                               </motion.span>
                             )}
                           </div>
                           <span style={{ fontSize: '1rem', marginLeft: '1rem' }}>{item.label}</span>
                           {item.name === 'Profile' && (
                             <motion.img
                               src={profilePicURL}
                               alt="Profile"
                               className="ms-auto rounded-circle"
                               width="24"
                               height="24"
                               whileHover={{ scale: 1.2 }}
                             />
                           )}
                         </motion.div>
                       </Nav.Link>
                     </motion.div>
                   ))}
                 </Nav>
       {/* ------------------------------------- */}
       <div className="mt-auto">
         <div className="mb-4" style={{ height: '1px', background: 'linear-gradient(to right, #FFC107, #34A85A)' }} />
         <motion.button
           whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 193, 7, 0.3)' }}
           whileTap={{ scale: 0.95 }}
           className="btn w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
           style={{ 
             background: 'linear-gradient(to right, #FFC107, #34A85A)',
             color: '#000000',
             border: 'none',
             padding: '0.75rem',
             borderRadius: '8px',
             fontWeight: '500'
           }}
           onClick={() => window.location.href = '/#/'} // Change '/home' to your desired route
         >
           <i className="fas fa-sign-out-alt"></i>
           Leave Community
         </motion.button>
       </div>
       
                 {/* ------------------------------------------ */}
               </motion.div>}
    </AnimatePresence>
  );
};

export default Community_Sidebar;