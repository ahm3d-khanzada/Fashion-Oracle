"use client"
import styled from "styled-components"
import { motion } from "framer-motion"

const ButtonContainer = styled(motion.button)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  svg {
    color: white;
  }
`

const ScrollDownButton = ({ targetId }) => {
  const scrollToContent = () => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <ButtonContainer
      onClick={scrollToContent}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, 10, 0],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14"></path>
        <path d="M19 12l-7 7-7-7"></path>
      </svg>
    </ButtonContainer>
  )
}

export default ScrollDownButton

