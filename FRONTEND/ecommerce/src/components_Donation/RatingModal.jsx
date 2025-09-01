import { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import styled from "styled-components"
import { motion } from "framer-motion"
import RatingStars from "./RatingStars"

const ModalTitle = styled(Modal.Title)`
  font-weight: bold;
`

const ModalBody = styled(Modal.Body)`
  padding: 20px;
`

const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`

const RatingLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 10px;
`

const FormGroup = styled(Form.Group)`
  margin-bottom: 20px;
`

const FormLabel = styled(Form.Label)`
  font-weight: 500;
  margin-bottom: 8px;
`

const FormControl = styled(Form.Control)`
  &:focus {
    border-color: #FFC107;
    box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  }
`

const SubmitButton = styled(Button)`
  background-color: #FFC107;
  border-color: #FFC107;
  width: 100%;
  font-weight: 500;

  &:hover {
    background-color: #e6af06;
    border-color: #e6af06;
  }

  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  }
`

const RatingModal = ({
  show,
  onHide,
  onSubmit,
  title = "Rate Your Experience",
  userToRate = "user",
  isLoading = false,
}) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (rating === 0) {
      return // Don't submit if no rating is selected
    }

    onSubmit({
      rating,
      comment,
    })
  }

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <ModalTitle>{title}</ModalTitle>
      </Modal.Header>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <RatingSection>
            <RatingLabel>How would you rate this {userToRate}?</RatingLabel>
            <RatingStars rating={rating} onChange={handleRatingChange} readonly={false} showText={true} size="32px" />
          </RatingSection>

          <FormGroup>
            <FormLabel>Additional Comments (Optional)</FormLabel>
            <FormControl
              as="textarea"
              rows={4}
              value={comment}
              onChange={handleCommentChange}
              placeholder={`Share your experience with this ${userToRate}...`}
            />
          </FormGroup>

          <div className="d-grid gap-2">
            <SubmitButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={rating === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                "Submit Rating"
              )}
            </SubmitButton>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default RatingModal

    