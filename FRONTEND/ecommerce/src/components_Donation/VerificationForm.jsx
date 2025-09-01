"use client"

import { useState } from "react"
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import FileUpload from "./FileUpload"
import { requestVerification } from "../actions/donationActions"
import { USER_VERIFY_RESET } from "../constants/donationConstants"

const FormContainer = styled(motion.div)`
  margin-bottom: 30px;
`

const FormTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 25px;
  font-weight: bold;
`

const FormSection = styled(Card)`
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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
    border-color: #34A85A;
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`

const FormSelect = styled(Form.Select)`
  &:focus {
    border-color: #34A85A;
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`

const SubmitButton = styled(Button)`
  background-color: #34A85A;
  border-color: #34A85A;
  padding: 10px 30px;
  font-weight: 500;
  
  &:hover {
    background-color: #2d9650;
    border-color: #2d9650;
  }
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`

const SuccessMessage = styled(motion.div)`
  padding: 20px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`

const ApiErrorMessage = styled(Alert)`
  margin-bottom: 20px;
`

const InfoText = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 20px;
`

const VerificationForm = () => {
  const dispatch = useDispatch()

  // Get user data from Redux store
  const userSignin = useSelector((state) => state.userSignin)
  const { userInfo } = userSignin

  // Get verification state from Redux
  const userVerify = useSelector((state) => state.userVerify || {})
  const { loading, success, error } = userVerify

  const [formData, setFormData] = useState({
    idType: "",
    idNumber: "",
    documents: [],
    address: "",
    phoneNumber: userInfo?.phone || "",
  })

  const [uploadError, setUploadError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDocumentUpload = (files) => {
    // Simulate API error for document upload (for demo purposes)
    // In a real app, this would be handled by the actual API response
    const simulateError = Math.random() < 0.3 // 30% chance of error

    if (simulateError) {
      setUploadError("There was an error uploading your documents. Please try again.")
      return
    }

    setUploadError(null)
    setFormData({
      ...formData,
      documents: files,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simulate API upload process
    setIsUploading(true)
    setUploadError(null)

    setTimeout(() => {
      // Simulate API error (for demo purposes)
      const simulateError = Math.random() < 0.2 // 20% chance of error

      if (simulateError) {
        setIsUploading(false)
        setUploadError("There was an error processing your verification request. Please try again later.")
        return
      }

      setIsUploading(false)

      // Submit verification request
      dispatch(requestVerification(formData))
    }, 2000)
  }

  const handleReset = () => {
    dispatch({ type: USER_VERIFY_RESET })
    setFormData({
      idType: "",
      idNumber: "",
      documents: [],
      address: "",
      phoneNumber: userInfo?.phone || "",
    })
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  // If user is already verified, show a message
  if (userInfo?.isVerified) {
    return (
      <FormContainer variants={formVariants} initial="hidden" animate="visible">
        <SuccessMessage initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h4>You are already verified!</h4>
          <p>Your account has been verified. You can enjoy all the benefits of being a verified user.</p>
        </SuccessMessage>
      </FormContainer>
    )
  }

  return (
    <FormContainer variants={formVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <FormTitle>Account Verification</FormTitle>
        <InfoText>
          Verified users enjoy priority in donation matching and higher trust ratings. Verification requires a valid ID
          and proof of address. Your information is securely stored and never shared with third parties.
        </InfoText>
      </motion.div>

      {error && (
        <motion.div variants={itemVariants}>
          <ApiErrorMessage variant="danger">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "10px" }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </ApiErrorMessage>
        </motion.div>
      )}

      {success ? (
        <SuccessMessage initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h4>Verification Request Submitted!</h4>
          <p>
            Your verification request has been submitted successfully. We'll review your documents and update your
            account status within 24-48 hours.
          </p>
          <Button variant="outline-success" onClick={handleReset} className="mt-3">
            Submit Another Request
          </Button>
        </SuccessMessage>
      ) : (
        <Form onSubmit={handleSubmit}>
          <motion.div variants={itemVariants}>
            <FormSection>
              <FormGroup>
                <FormLabel>ID Type</FormLabel>
                <FormSelect name="idType" value={formData.idType} onChange={handleChange} required>
                  <option value="">Select ID Type</option>
                  <option value="passport">Passport</option>
                  <option value="driverLicense">Driver's License</option>
                  <option value="nationalId">National ID Card</option>
                  <option value="voterCard">Voter's Card</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>ID Number</FormLabel>
                <FormControl
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="Enter your ID number"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FileUpload
                  label="Upload ID Document & Proof of Address"
                  accept="image/*,.pdf"
                  multiple={true}
                  minFiles={2}
                  maxFiles={5}
                  maxFileSize={5}
                  helpText="Please upload clear images of your ID (front and back) and a proof of address (utility bill, bank statement, etc.). PDF or image formats accepted."
                  onChange={handleDocumentUpload}
                  value={formData.documents}
                  isUploading={isUploading}
                  uploadError={uploadError}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Full Address</FormLabel>
                <FormControl
                  as="textarea"
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Phone Number</FormLabel>
                <FormControl
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </FormGroup>
            </FormSection>
          </motion.div>

          <motion.div variants={itemVariants} className="d-grid gap-2">
            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading || isUploading}
            >
              {loading || isUploading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  {isUploading ? "Uploading Documents..." : "Submitting Request..."}
                </>
              ) : (
                "Submit Verification Request"
              )}
            </SubmitButton>
          </motion.div>
        </Form>
      )}
    </FormContainer>
  )
}

export default VerificationForm

