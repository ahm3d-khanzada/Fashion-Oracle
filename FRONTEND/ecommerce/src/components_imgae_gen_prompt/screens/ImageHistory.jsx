"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserImages } from "../../actions/Image_Gen_Actions"

function ImageHistory({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const imageGenerationState = useSelector((state) => state.imageGeneration) || {
    historyLoading: false,
    history: [],
    historyError: null,
  }
  const { historyLoading, history, historyError } = imageGenerationState
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUserImages())
    }
  }, [isOpen, dispatch])

  useEffect(() => {
    if (isOpen && !hasFetchedOnce && history.length === 0) {
      dispatch(fetchUserImages())
      setHasFetchedOnce(true)
    }
  }, [isOpen, hasFetchedOnce, dispatch, history.length])


  useEffect(() => {
    if (history.length > 0) {
      setHasFetchedOnce(true)
    }
  }, [history.length])
  
  const handleDownload = (imageUrl, prompt) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `ai-fashion-${prompt.slice(0, 10)}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="history-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="history-content">
            <div className="history-header">
              <h2>Your Generated Designs</h2>
              <button className="close-btn" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {historyLoading && (
              <div className="loading-animation">
                <div className="spinner"></div>
                <p>Loading your design history...</p>
              </div>
            )}

            {historyError && (
              <div className="error-message">
                <p>{historyError}</p>
                <button onClick={() => dispatch(fetchUserImages())}>Retry</button>
              </div>
            )}

            {!historyLoading && !historyError && history.length === 0 && (
              <div className="no-images">
                <p>No designs generated yet.</p>
                <p>Start creating with the AI Fashion Designer!</p>
              </div>
            )}

            {!historyLoading && !historyError && history.length > 0 && (
              <div className="history-grid">
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    className="history-item"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="image-container">
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="history-image"
                      />
                      <div className="image-overlay">
                        <button
                          className="download-btn"
                          onClick={() => handleDownload(item.imageUrl, item.prompt)}
                        >
                          <i className="fas fa-download"></i> Download
                        </button>
                      </div>
                    </div>
                    <div className="history-details">
                      <p className="prompt">{item.prompt}</p>
                      <p className="created-at">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <style jsx>{`
            .history-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.85);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
              padding: 20px;
            }

            .history-content {
              background: rgba(20, 20, 20, 0.95);
              border-radius: 16px;
              padding: 30px;
              width: 100%;
              max-width: 1200px;
              max-height: 90vh;
              overflow-y: auto;
              border: 1px solid rgba(255, 255, 255, 0.1);
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
            }

            .history-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding-bottom: 15px;
            }

            .history-header h2 {
              color: #fff;
              font-size: 2rem;
              font-weight: 700;
              margin: 0;
              background: linear-gradient(135deg, #34A85A, #FFC107);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            .close-btn {
              background: rgba(255, 255, 255, 0.1);
              border: none;
              color: #fff;
              font-size: 1.5rem;
              cursor: pointer;
              padding: 10px;
              border-radius: 50%;
              transition: all 0.2s;
            }

            .close-btn:hover {
              background: #34A85A;
              color: #fff;
              transform: scale(1.1);
            }

            .loading-animation {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 200px;
              color: rgba(255, 255, 255, 0.8);
            }

            .spinner {
              width: 60px;
              height: 60px;
              border: 4px solid rgba(52, 168, 90, 0.3);
              border-radius: 50%;
              border-top-color: #34A85A;
              animation: spin 1s linear infinite;
              margin-bottom: 20px;
            }

            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }

            .error-message {
              background: rgba(231, 76, 60, 0.15);
              border: 1px solid rgba(231, 76, 60, 0.3);
              color: #e74c3c;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px;
              margin: 20px 0;
            }

            .error-message p {
              margin: 0;
              font-size: 1.1rem;
            }

            .error-message button {
              background: #e74c3c;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
              font-weight: 600;
              transition: all 0.2s;
            }

            .error-message button:hover {
              background: #c0392b;
              transform: translateY(-1px);
            }

            .no-images {
              text-align: center;
              color: rgba(255, 255, 255, 0.7);
              padding: 40px 0;
            }

            .no-images p {
              margin: 10px 0;
              font-size: 1.2rem;
            }

            .no-images p:nth-child(2) {
              color: rgba(255, 255, 255, 0.5);
              font-size: 1rem;
            }

            .history-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 25px;
              padding: 10px;
            }

            .history-item {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid rgba(255, 255, 255, 0.08);
              transition: transform 0.2s, box-shadow 0.2s;
            }

            .history-item:hover {
              transform: translateY(-5px);
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }

            .image-container {
              position: relative;
              width: 100%;
              padding-top: 75%; /* 4:3 aspect ratio */
            }

            .history-image {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              object-fit: contain;
              background: #000;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .image-overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              opacity: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: opacity 0.2s;
            }

            .image-container:hover .image-overlay {
              opacity: 1;
            }

            .download-btn {
              background: #34A85A;
              color: white;
              border: none;
              border-radius: 8px;
              padding: 10px 20px;
              font-size: 0.95rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .download-btn:hover {
              background: #2c8f4c;
              transform: scale(1.05);
            }

            .history-details {
              padding: 15px;
              display: flex;
              flex-direction: column;
              gap: 10px;
            }

            .prompt {
              color: #fff;
              font-size: 1rem;
              font-weight: 500;
              margin: 0;
              line-height: 1.4;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .created-at {
              color: rgba(255, 255, 255, 0.6);
              font-size: 0.85rem;
              margin: 0;
            }

            @media (max-width: 768px) {
              .history-content {
                padding: 20px;
                max-height: 95vh;
              }

              .history-header h2 {
                font-size: 1.6rem;
              }

              .history-grid {
                grid-template-columns: 1fr;
                gap: 20px;
              }

              .image-container {
                padding-top: 100%; /* Square for mobile */
              }
            }

            @media (max-width: 480px) {
              .history-modal {
                padding: 10px;
              }

              .history-content {
                padding: 15px;
              }

              .history-header h2 {
                font-size: 1.4rem;
              }

              .close-btn {
                font-size: 1.2rem;
                padding: 8px;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImageHistory