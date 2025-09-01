"use client"
import { Modal, Button } from "react-bootstrap"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"

const ModalTitle = styled(motion(Modal.Title))`
  font-weight: bold;
  font-size: 1.5rem;
`

const ModalBody = styled(motion(Modal.Body))`
  padding: 2rem;
  text-align: center;
`

const IconContainer = styled(motion.div)`
  margin-bottom: 1.5rem;
  color: ${(props) => props.iconColor || "#dc3545"};
  
  svg {
    width: 80px;
    height: 80px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }
`

const ButtonContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`

const CancelButton = styled(Button)`
  min-width: 120px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
`

const ConfirmButton = styled(Button)`
  min-width: 120px;
  border-radius: 8px;
  font-weight: 500;
  background-color: ${(props) => props.confirmColor || "#dc3545"};
  border-color: ${(props) => props.confirmColor || "#dc3545"};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${(props) => props.confirmHoverColor || "#c82333"};
    border-color: ${(props) => props.confirmHoverColor || "#c82333"};
    transform: translateY(-2px);
  }
`

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  exit: { opacity: 0, scale: 0.8 }
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

const spinTransition = {
  loop: Infinity,
  duration: 1,
  ease: "linear"
}

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "#dc3545",
  confirmHoverColor = "#c82333",
  iconColor = "#dc3545",
  icon,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <Modal 
          show={show} 
          onHide={onHide} 
          centered 
          backdrop="static" 
          keyboard={false}
          as={motion.div}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Modal.Header closeButton>
            <ModalTitle
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </ModalTitle>
          </Modal.Header>
          
          <ModalBody
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            {icon && (
              <IconContainer 
                iconColor={iconColor}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {icon}
              </IconContainer>
            )}

            <motion.p
              className="lead mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>

            <ButtonContainer
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1 }}
            >
              <CancelButton 
                as={motion.button}
                variant="outline-secondary"
                onClick={onHide}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {cancelText}
              </CancelButton>
              
              <ConfirmButton
                as={motion.button}
                confirmColor={confirmColor}
                confirmHoverColor={confirmHoverColor}
                onClick={onConfirm}
                disabled={isLoading}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -2, 2, -2, 0],
                  transition: { duration: 0.4 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {isLoading ? (
                  <motion.div
                    className="d-flex align-items-center justify-content-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.span 
                      animate={{ rotate: 360 }}
                      transition={spinTransition}
                      className="spinner-border spinner-border-sm me-2" 
                      role="status" 
                    />
                    Processing...
                  </motion.div>
                ) : (
                  confirmText
                )}
              </ConfirmButton>
            </ButtonContainer>
          </ModalBody>
        </Modal>
      )}
    </AnimatePresence>
  )
}

export default ConfirmationModal