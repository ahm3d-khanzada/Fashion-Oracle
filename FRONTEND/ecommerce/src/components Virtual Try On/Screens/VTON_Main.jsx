// VTON_Main.jsx (Updated to fix download behavior)
"use client";

import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Alert, Row, Col, Spinner } from "react-bootstrap";
import {
  uploadClothImage,
  uploadHumanImage,
  performVirtualTryOn,
  fetchVTONHistory,
} from "../../actions/VTON_Action";
import { useDropzone } from "react-dropzone";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonLoader from "./SkeletonLoader";

const VTON_Main = () => {
  const [clothImage, setClothImage] = useState(null);
  const [humanImage, setHumanImage] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadError, setUploadError] = useState({ cloth: null, human: null });

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userSignin);
  const { loading, error, result, history, historyLoading, historyError } = useSelector((state) => state.vton);

  const isAuthenticated = !!userInfo;

  useEffect(() => {
    if (!loading && showSkeleton) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, showSkeleton]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchVTONHistory());
    }
  }, [dispatch, isAuthenticated]);

  const handleImageUpload = useCallback(
    (files, type) => {
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type === "image/png" || file.type === "image/jpeg") {
          if (type === "cloth") {
            setClothImage(file);
            dispatch(uploadClothImage(file))
              .then(() => setUploadError((prev) => ({ ...prev, cloth: null })))
              .catch((err) =>
                setUploadError((prev) => ({ ...prev, cloth: err.message }))
              );
          } else {
            setHumanImage(file);
            dispatch(uploadHumanImage(file))
              .then(() => setUploadError((prev) => ({ ...prev, human: null })))
              .catch((err) =>
                setUploadError((prev) => ({ ...prev, human: err.message }))
              );
          }
        } else {
          setUploadError((prev) => ({
            ...prev,
            [type]: "Only PNG or JPG images are allowed.",
          }));
        }
      }
    },
    [dispatch]
  );

  const onDropCloth = useCallback(
    (acceptedFiles) => handleImageUpload(acceptedFiles, "cloth"),
    [handleImageUpload]
  );

  const onDropHuman = useCallback(
    (acceptedFiles) => handleImageUpload(acceptedFiles, "human"),
    [handleImageUpload]
  );

  const { getRootProps: getClothRootProps, getInputProps: getClothInputProps } =
    useDropzone({
      onDrop: onDropCloth,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
      },
    });

  const { getRootProps: getHumanRootProps, getInputProps: getHumanInputProps } =
    useDropzone({
      onDrop: onDropHuman,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
      },
    });

  const handleTryOn = () => {
    if (!isAuthenticated) {
      setShake(true);
      setTimeout(() => setShake(false), 820);
      return;
    }
    if (!clothImage || !humanImage) {
      setErrorMessage("Please upload both a cloth image and a human image before trying on.");
      return;
    }
    if (uploadError.cloth || uploadError.human) {
      setErrorMessage("Please fix the errors in the uploaded images before trying on.");
      return;
    }
    setShowSkeleton(true);
    dispatch(performVirtualTryOn(clothImage, humanImage)).then(() => {
      dispatch(fetchVTONHistory()); // Refresh history after successful try-on
    });
  };

  const removeImage = (type) => {
    if (type === "cloth") {
      setClothImage(null);
      setUploadError((prev) => ({ ...prev, cloth: null }));
    } else {
      setHumanImage(null);
      setUploadError((prev) => ({ ...prev, human: null }));
    }
  };

  const handleDownload = async () => {
    if (result && result.result) {
      try {
        const response = await fetch(result.result, {
          mode: "cors", // allow cross-origin if supported
        });
  
        if (!response.ok) throw new Error("Network response was not ok");
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
  
        link.href = url;
        link.download = "virtual-try-on-result.png";
  
        // Ensure download even if browser tries to open it
        link.setAttribute("download", "virtual-try-on-result.png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        alert("Image download failed. Try right-clicking and choosing 'Save image as...'");
      }
    }
  };
  
  const handleHistoryDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, {
        mode: "cors",
      });
  
      if (!response.ok) throw new Error("Image not available for download");
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
  
      link.href = url;
      link.download = `vton-history-${Date.now()}.png`;
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("History download failed:", error);
      alert("History image download failed. Try right-clicking the image instead.");
    }
  };
  
  return (
    <div style={styles.container}>
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={styles.alertContainer}
          >
            <Alert variant="warning" style={styles.authAlert}>
              🔒 Please login to use the Virtual Try-On feature
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      <Row>
        <Col md={6}>
          <motion.div
            style={styles.uploadSection}
            {...getClothRootProps()}
            whileHover={{ boxShadow: "0 0 0 2px #34A85A" }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={styles.sectionTitle}>Upload Cloth Image</h3>
            <input {...getClothInputProps()} />
            <AnimatePresence>
              {clothImage ? (
                <motion.div
                  key="clothPreview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={styles.imagePreviewContainer}
                >
                  <img
                    src={URL.createObjectURL(clothImage) || "/placeholder.svg"}
                    alt="Cloth"
                    style={styles.previewImage}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    style={styles.removeImageButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage("cloth");
                    }}
                  >
                    <X size={20} />
                  </Button>
                </motion.div>
              ) : (
                <motion.p
                  key="clothDropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={styles.dropzoneText}
                >
                  Drag and drop a cloth image here, or click to select a file
                  (PNG or JPG only)
                </motion.p>
              )}
            </AnimatePresence>
            {uploadError.cloth && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="danger" style={styles.errorAlert}>
                  {uploadError.cloth}
                </Alert>
              </motion.div>
            )}
          </motion.div>
        </Col>
        <Col md={6}>
          <motion.div
            style={styles.uploadSection}
            {...getHumanRootProps()}
            whileHover={{ boxShadow: "0 0 0 2px #34A85A" }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={styles.sectionTitle}>Upload Human Image</h3>
            <input {...getHumanInputProps()} />
            <AnimatePresence>
              {humanImage ? (
                <motion.div
                  key="humanPreview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={styles.imagePreviewContainer}
                >
                  <img
                    src={URL.createObjectURL(humanImage) || "/placeholder.svg"}
                    alt="Human"
                    style={styles.previewImage}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    style={styles.removeImageButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage("human");
                    }}
                  >
                    <X size={20} />
                  </Button>
                </motion.div>
              ) : (
                <motion.p
                  key="humanDropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={styles.dropzoneText}
                >
                  Drag and drop a human image here, or click to select a file
                  (PNG or JPG only)
                </motion.p>
              )}
            </AnimatePresence>
            {uploadError.human && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="danger" style={styles.errorAlert}>
                  {uploadError.human}
                </Alert>
              </motion.div>
            )}
          </motion.div>
        </Col>
      </Row>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={styles.tryOnButtonContainer}
      >
        <Button onClick={handleTryOn} style={styles.tryOnButton}>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <motion.span
              initial={{ y: 0 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              Virtual Try On
            </motion.span>
          )}
        </Button>
      </motion.div>
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="danger" style={styles.errorAlert}>
            {errorMessage}
          </Alert>
        </motion.div>
      )}
      <AnimatePresence>
        {showSkeleton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SkeletonLoader />
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="danger" style={styles.errorAlert}>
            {error}
          </Alert>
        </motion.div>
      )}
      <AnimatePresence>
        {!loading && !showSkeleton && result && isAuthenticated && (
          <motion.div
            key="resultContainer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={styles.resultContainer}
          >
            <h3 style={styles.resultTitle}>Virtual Try-On Result</h3>
            <div style={styles.resultImageContainer}>
              <motion.img
                src={result.result || "/placeholder.svg"}
                alt="Virtual Try-On Result"
                style={styles.resultImage}
                layoutId="resultImage"
              />
            </div>
            <Button onClick={handleDownload} style={styles.downloadButton}>
              <Download size={20} style={{ marginRight: "10px" }} />
              Download Result
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAuthenticated && (
          <motion.div
            key="historyContainer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={styles.historyContainer}
          >
            <h3 style={styles.historyTitle}>Your Recent Try-Ons</h3>
            {historyLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Spinner animation="border" style={{ margin: "20px auto", display: "block" }} />
              </motion.div>
            )}
            {historyError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="danger" style={styles.errorAlert}>
                  {historyError}
                </Alert>
              </motion.div>
            )}
            {!historyLoading && !historyError && history.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={styles.noHistoryText}
              >
                No try-ons yet. Start by uploading images above!
              </motion.p>
            )}
            {!historyLoading && !historyError && history.length > 0 && (
              <Row>
                {history.map((record, index) => (
                  <Col md={4} key={record.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      style={styles.historyItem}
                    >
                      <h4 style={styles.historyItemTitle}>Try-On #{record.id}</h4>
                      <div style={styles.historyImageContainer}>
                        <img
                          src={record.cloth_image.image}
                          alt="Cloth"
                          style={styles.historyImage}
                        />
                        <img
                          src={record.human_image.image}
                          alt="Human"
                          style={styles.historyImage}
                        />
                        <img
                          src={record.generated_image}
                          alt="Generated Try-On"
                          style={styles.historyImage}
                        />
                      </div>
                      <Button
                        onClick={() => handleHistoryDownload(record.generated_image)}
                        style={styles.downloadButton}
                      >
                        <Download size={20} style={{ marginRight: "10px" }} />
                        Download Try-On
                      </Button>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000000",
    padding: "20px",
    color: "#FFFFFF",
  },
  alertContainer: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    marginBottom: "20px",
  },
  authAlarmContainer: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    marginBottom: "20px",
  },
  authAlert: {
    textAlign: "center",
    fontSize: "18px",
    padding: "15px",
    border: "1px solid #FFC107",
    maxWidth: "800px",
    margin: "0 auto 20px",
  },
  uploadSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    padding: "20px",
    marginBottom: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  sectionTitle: {
    fontSize: "22px",
    marginBottom: "15px",
    color: "#FFC107",
  },
  imagePreviewContainer: {
    position: "relative",
    width: "100%",
    height: "300px",
    borderRadius: "10px",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "10px",
  },
  removeImageButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "0",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  dropzoneText: {
    textAlign: "center",
    color: "#CCCCCC",
    fontSize: "16px",
    marginTop: "20px",
  },
  tryOnButtonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "20px",
  },
  tryOnButton: {
    padding: "15px 30px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #34A85A, #FFC107)",
    border: "none",
    borderRadius: "50px",
    color: "#000000",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  resultContainer: {
    background:
      "linear-gradient(135deg, rgba(52, 168, 90, 0.1), rgba(255, 193, 7, 0.1))",
    borderRadius: "15px",
    padding: "20px",
    marginTop: "20px",
    border: "2px solid rgba(255, 193, 7, 0.5)",
  },
  resultImageContainer: {
    border: "2px dashed rgba(255, 193, 7, 0.5)",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "20px",
  },
  resultImage: {
    width: "100%",
    maxHeight: "500px",
    objectFit: "contain",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  downloadButton: {
    backgroundColor: "#34A85A",
    border: "none",
    borderRadius: "25px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    transition: "all 0.3s ease",
  },
  errorAlert: {
    marginBottom: "20px",
  },
  historyContainer: {
    background:
      "linear-gradient(135deg, rgba(52, 168, 90, 0.1), rgba(255, 193, 7, 0.1))",
    borderRadius: "15px",
    padding: "20px",
    marginTop: "20px",
    border: "2px solid rgba(255, 193, 7, 0.5)",
  },
  historyTitle: {
    fontSize: "22px",
    marginBottom: "15px",
    color: "#FFC107",
    textAlign: "center",
  },
  historyItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px",
  },
  historyItemTitle: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#FFFFFF",
  },
  historyImageContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  historyImage: {
    width: "32%", // Adjusted to fit three images
    height: "150px",
    objectFit: "contain",
    borderRadius: "5px",
    border: "1px solid rgba(255, 193, 7, 0.3)",
  },
  noHistoryText: {
    textAlign: "center",
    color: "#CCCCCC",
    fontSize: "16px",
    marginTop: "20px",
  },
};

export default VTON_Main;