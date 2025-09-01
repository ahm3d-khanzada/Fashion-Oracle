"use client"

import { Link } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"
import { Button } from "react-bootstrap"

const PromptContainer = styled(motion.div)`
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

const PromptIcon = styled.div`
  margin-bottom: 20px;
  color: ${props => props.iconColor || "#FFC107"};

  svg {
    width: 80px;
    height: 80px;
  }
`

const PromptTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`

const PromptDescription = styled.p`
  font-size: 1rem;
  color: #6c757d;
  max-width: 400px;
  margin-bottom: 20px;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`

const LoginButton = styled(Button)`
  background-color: ${props => props.primaryColor || "#34A85A"};
  border-color: ${props => props.primaryColor || "#34A85A"};
  padding: 10px 20px;
  
  &:hover {
    background-color: ${props => props.primaryHoverColor || "#2d9650"};
    border-color: ${props => props.primaryHoverColor || "#2d9650"};
  }
`

const RegisterButton = styled(Button)`
  background-color: transparent;
  border-color: ${props => props.secondaryColor || "#FFC107"};
  color: ${props => props.secondaryColor || "#FFC107"};
  padding: 10px 20px;
  
  &:hover {
    background-color: ${props => props.secondaryColor || "#FFC107"};
    color: white;
  }
`

const BrowseButton = styled(Button)`
  background-color: transparent;
  border: none;
  color: #6c757d;
  text-decoration: underline;
  margin-top: 15px;
  
  &:hover {
    color: #343a40;
    background-color: transparent;
  }
`

const LoginPrompt = ({
  title = "Authentication Required",
  description = "You need to be logged in to access this feature.",
  loginPath = "/login",
  registerPath = "/register",
  browsePath,
  primaryColor = "#34A85A",
  primaryHoverColor = "#2d9650",
  secondaryColor = "#FFC107",
  iconColor = "#FFC107",
  icon,
  showBrowseOption = false,
  browseText = "Continue browsing without logging in"
}) => {
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

  return (
    <PromptContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <PromptIcon iconColor={iconColor}>
          {icon || (
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
          )}
        </PromptIcon>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PromptTitle>{title}</PromptTitle>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PromptDescription>{description}</PromptDescription>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ButtonsContainer>
          <Link to={loginPath}>
            <LoginButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              primaryColor={primaryColor}
              primaryHoverColor={primaryHoverColor}
            >
              Log In
            </LoginButton>
          </Link>
          <Link to={registerPath}>
            <RegisterButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              secondaryColor={secondaryColor}
            >
              Register
            </RegisterButton>
          </Link>
        </ButtonsContainer>
      </motion.div>

      {showBrowseOption && browsePath && (
        <motion.div variants={itemVariants}>
          <Link to={browsePath}>
            <BrowseButton>{browseText}</BrowseButton>
          </Link>
        </motion.div>
      )}
    </PromptContainer>
  )
}

export default LoginPrompt
