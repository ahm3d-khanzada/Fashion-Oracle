"use client"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"

const AuthContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 40px auto;
`

const AuthIcon = styled.div`
  margin-bottom: 20px;
  color: #FFC107;

  svg {
    width: 80px;
    height: 80px;
  }
`

const AuthTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`

const AuthDescription = styled.p`
  font-size: 1rem;
  color: #6c757d;
  max-width: 400px;
  margin-bottom: 20px;
`

const AuthButton = styled(motion.button)`
  background-color: #34A85A;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #2d9650;
  }
`

const AuthCheck = ({
  children,
  redirectTo = "/login",
  message = "You need to be logged in to access this feature. Please sign in or create an account to continue.",
  title = "Authentication Required",
  featureName = null,
}) => {
  const userSignin = useSelector((state) => state.userSignin)
  const { userInfo } = userSignin

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  // If user is logged in, render the children components
  if (userInfo) {
    return children
  }

  // If user is not logged in, show authentication required message
  return (
    <AuthContainer variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <AuthIcon>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </AuthIcon>
      </motion.div>

      <motion.div variants={itemVariants}>
        <AuthTitle>{featureName ? `${featureName} - ${title}` : title}</AuthTitle>
      </motion.div>

      <motion.div variants={itemVariants}>
        <AuthDescription>{message}</AuthDescription>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link to={redirectTo}>
          <AuthButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Sign In / Register
          </AuthButton>
        </Link>
      </motion.div>
    </AuthContainer>
  )
}

export default AuthCheck

