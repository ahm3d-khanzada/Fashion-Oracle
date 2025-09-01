"use client"
import styled from "styled-components"
import { motion } from "framer-motion"

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: ${(props) => props.bgColor || "white"};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`

const IconContainer = styled(motion.div)`
  margin-bottom: 20px;
  color: ${(props) => props.iconColor || "#adb5bd"};
  
  svg {
    width: 80px;
    height: 80px;
  }
`

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${(props) => props.titleColor || "#333"};
`

const Description = styled.p`
  font-size: 1rem;
  color: #6c757d;
  max-width: 400px;
  margin-bottom: 20px;
`

const ActionButton = styled(motion.button)`
  background-color: ${(props) => props.buttonColor || "#34A85A"};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: ${(props) => props.buttonHoverColor || "#2d9650"};
  }
`

const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  iconColor,
  titleColor,
  buttonColor,
  buttonHoverColor,
  bgColor,
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
    <Container variants={containerVariants} initial="hidden" animate="visible" bgColor={bgColor}>
      <IconContainer variants={itemVariants} iconColor={iconColor}>
        {icon}
      </IconContainer>

      <motion.div variants={itemVariants}>
        <Title titleColor={titleColor}>{title}</Title>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Description>{description}</Description>
      </motion.div>

      {actionText && onAction && (
        <motion.div variants={itemVariants}>
          <ActionButton
            onClick={onAction}
            buttonColor={buttonColor}
            buttonHoverColor={buttonHoverColor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {actionText}
          </ActionButton>
        </motion.div>
      )}
    </Container>
  )
}

export default EmptyState

