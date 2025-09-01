import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uploadImage, getRecommendation } from "../../actions/Recommendation_Action";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button, Alert, Row, Col } from "react-bootstrap";
import Recommendation_Loader from "./Recommendation_Loader";

const Recommendation_Main = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const isAuthenticated = useSelector((state) => state.userSignin.userInfo !== null);
  const { uploadedImage, recommendation, loading, error } = useSelector((state) => state.clothing);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    // Validate image type
    if (!file.type.startsWith("image/")) {
      setValidationError("Please upload a valid image file (JPG, PNG, etc.)");
      return;
    }

    setValidationError(null);
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
  
    if (!selectedImage) {
      setValidationError("Please upload an image first");
      return;
    }
  
    try {
      // Upload image and wait for the result
      const uploadResult = await dispatch(uploadImage(selectedImage));
      
      // Use the returned data directly
      if (uploadResult?.id) {
        await dispatch(getRecommendation(uploadResult.id));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div style={styles.container}>
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.authAlert}
        >
          <Alert variant="warning">
            🔒 Please login to get personalized recommendations
          </Alert>
        </motion.div>
      )}

      <Row className="justify-content-center">
        <Col md={6} className="mb-4 mb-md-0 pe-md-4">
          <motion.div
            style={styles.uploadSection}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 style={styles.sectionTitle}>Upload Your Clothing</h3>

            <div style={styles.uploadBox}>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                style={styles.fileInput}
              />
              {!previewUrl && (
                <div style={styles.uploadPrompt}>
                  <span style={styles.uploadText}>Click to Upload</span>
                  <span style={styles.uploadSubtext}>Supports: JPG, PNG</span>
                </div>
              )}
              {previewUrl && (
                <>
                  <motion.img
                    src={previewUrl}
                    alt="Preview"
                    style={styles.previewImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <button
                    style={styles.clearImageButton}
                    onClick={handleClearImage}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </Col>

        <Col md={6} className="ps-md-4">
          <motion.div
            style={styles.recommendationSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 style={styles.sectionTitle}>Recommendation</h3>

            <button
              style={styles.recommendButton}
              onClick={handleSubmit}
              disabled={!isAuthenticated || !selectedImage || loading}
            >
              {loading ? <Recommendation_Loader /> : "✨ Generate Recommendation"}
            </button>

            {recommendation && (
              <motion.div
                style={styles.recommendationResult}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
              <img
                src={recommendation.recommendationUrl}
                alt="Recommendation"
                style={styles.recommendationImage}
              />
              </motion.div>
            )}

            {/* Validation Errors */}
            {validationError && (
              <motion.div
                style={styles.errorAlert}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="danger">{validationError}</Alert>
              </motion.div>
            )}

            {/* API/Backend Errors */}
            {error && (
              <motion.div
                style={styles.errorAlert}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="danger">
                  ⚠️ {error}
                </Alert>
              </motion.div>
            )}
          </motion.div>
        </Col>
      </Row>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔒 Authentication Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          To get personalized recommendations, please login or create an account.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Later
          </Button>
          <Button variant="primary" onClick={() => (window.location.href = "/signin")}>
            Login Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000",
    padding: "20px",
  },
  authAlert: {
    maxWidth: "800px",
    margin: "0 auto 20px",
  },
  uploadSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "15px",
    padding: "20px",
    height: "100%",
  },
  recommendationSection: {
    backgroundColor: "rgba(52, 168, 90, 0.1)",
    borderRadius: "15px",
    padding: "20px",
    height: "100%",
  },
  sectionTitle: {
    color: "#FFC107",
    fontSize: "22px",
    marginBottom: "20px",
    textAlign: "center",
  },
  uploadBox: {
    border: "2px dashed #34A85A",
    borderRadius: "12px",
    height: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    "@media (max-width: 768px)": {
      height: "300px",
    },
  },
  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  uploadPrompt: {
    textAlign: "center",
    zIndex: 1,
  },
  uploadText: {
    color: "#FFF",
    fontSize: "18px",
    display: "block",
    marginBottom: "10px",
  },
  uploadSubtext: {
    color: "#888",
    fontSize: "14px",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "12px",
  },
  clearImageButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    border: "none",
    color: "#FFF",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "24px",
    zIndex: 2,
    "@media (max-width: 768px)": {
      top: "10px",
      right: "10px",
      width: "30px",
      height: "30px",
      fontSize: "18px",
    },
  },
  recommendButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#FFC107",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "20px",
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  recommendationResult: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%", // Ensure the container doesn't exceed its parent
  },
  recommendationImage: {
      width: "500px", // Fixed width
      height: "auto", // Maintain aspect ratio
      borderRadius: "12px",
      border: "2px solid #34A85A",
      objectFit: "contain",
  },
  errorAlert: {
    marginTop: "20px",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
    maxWidth: "90%",
  },
};

export default Recommendation_Main;