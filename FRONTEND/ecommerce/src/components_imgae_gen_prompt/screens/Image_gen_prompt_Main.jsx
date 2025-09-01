"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { generateImage, fetchUserImages } from "../../actions/Image_Gen_Actions"
import ImageHistory from "./ImageHistory"

function Image_gen_prompt_Main() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const dispatch = useDispatch()
  const imageGenerationState = useSelector((state) => state.imageGeneration) || {
    loading: false,
    image: null,
    error: null,
    history: [],
    historyLoading: false,
    historyError: null,
  }
  const { loading, image, error } = imageGenerationState

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      setIsGenerating(true)
      dispatch(generateImage(prompt))
    }
  }

  // Reset generating state and fetch history when loading completes
  useEffect(() => {
    if (!loading && isGenerating) {
      setIsGenerating(false)
      if (image && !error) {
        dispatch(fetchUserImages()) // Fetch history after successful generation
      }
    }
  }, [loading, isGenerating, image, error, dispatch])

  // Handle prompt input changes
  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
  }

  // Clear the current result and reset
  const handleReset = () => {
    setPrompt("")
    dispatch({ type: "IMAGE_GENERATION_RESET" })
  }

  return (
    <div className="image-gen-container">
      <div className="background-gradient"></div>

      <div className="content-area">
        <div className="header-section">
          <h1 className="title">AI Fashion Designer</h1>
          <p className="subtitle">Create unique clothing designs with artificial intelligence</p>
        </div>

        <div className="input-section">
          <form onSubmit={handleSubmit} className="prompt-form">
            <div className="input-wrapper">
              <input
                type="text"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Describe the clothing you want to generate..."
                className="prompt-input"
                disabled={loading}
              />
              <button type="submit" className="generate-btn" disabled={loading || !prompt.trim()}>
                {loading ? (
                  <span className="loading-text">
                    Generating<span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                  </span>
                ) : (
                  "Generate"
                )}
              </button>
            </div>

            <div className="examples">
              <p>Examples:</p>
              <div className="example-tags">
                <button type="button" onClick={() => setPrompt("A minimalist summer dress with floral patterns")}>
                  Summer dress
                </button>
                <button type="button" onClick={() => setPrompt("Futuristic streetwear jacket with neon accents")}>
                  Streetwear jacket
                </button>
                <button type="button" onClick={() => setPrompt("Elegant evening gown with embroidered details")}>
                  Evening gown
                </button>
              </div>
            </div>
          </form>
          <button
            className="history-btn"
            onClick={() => setShowHistory(true)}
          >
            <i className="fas fa-history"></i> View History
          </button>
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div
              className="loading-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="spinner"></div>
              <p>Creating your design. This may take a moment...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!loading && image && (
            <motion.div
              className="result-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="image-result">
                <img src={image || "/placeholder.svg"} alt="Generated clothing design" />
              </div>

              <div className="result-actions">
                <button
                  className="action-btn download-btn"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = image
                    link.download = `ai-fashion-${Date.now()}.png`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                >
                  <i className="fas fa-download"></i> Download
                </button>

                <button className="action-btn reset-btn" onClick={handleReset}>
                  <i className="fas fa-redo"></i> Create New
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => dispatch({ type: "IMAGE_GENERATION_RESET" })}>Try Again</button>
          </div>
        )}

        <ImageHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>

      <style jsx>{`
        .image-gen-container {
          position: relative;
          min-height: calc(100vh - 80px);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          overflow: hidden;
        }
        
        .background-gradient {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #000000, #111111);
          z-index: -1;
        }
        
        .background-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 40%, rgba(52, 168, 90, 0.4) 0%, rgba(0, 0, 0, 0) 50%),
                    radial-gradient(circle at 70% 60%, rgba(255, 193, 7, 0.3) 0%, rgba(0, 0, 0, 0) 50%);
          opacity: 0.7;
        }
        
        .content-area {
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .header-section {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #34A85A, #FFC107);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .input-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .prompt-form {
          width: 100%;
        }
        
        .input-wrapper {
          display: flex;
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .prompt-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 8px;
          padding: 16px 20px;
          font-size: 1rem;
          color: #333;
          transition: all 0.3s;
        }
        
        .prompt-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(52, 168, 90, 0.5);
        }
        
        .prompt-input::placeholder {
          color: rgba(0, 0, 0, 0.4);
        }
        
        .generate-btn {
          background: #34A85A;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0 24px;
          margin-left: 6px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .generate-btn:hover {
          background: #2c8f4c;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(52, 168, 90, 0.3);
        }
        
        .generate-btn:active {
          transform: translateY(1px);
        }
        
        .generate-btn:disabled {
          background: #666;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .loading-text {
          display: flex;
          align-items: center;
        }
        
        .dot {
          animation: loadingDots 1.4s infinite;
          opacity: 0;
          margin-left: 2px;
        }
        
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes loadingDots {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        .examples {
          margin-top: 16px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .examples p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-right: 4px;
        }
        
        .example-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .example-tags button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.85rem;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .example-tags button:hover {
          background: rgba(52, 168, 90, 0.2);
          border-color: rgba(52, 168, 90, 0.4);
        }
        
        .history-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          align-self: center;
        }
        
        .history-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        
        .loading-animation {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(52, 168, 90, 0.3);
          border-radius: 50%;
          border-top-color: #34A85A;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .result-container {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .image-result {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .image-result img {
          max-width: 100%;
          max-height: 400px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .result-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        .action-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .download-btn {
          background: #34A85A;
          color: white;
          border: none;
        }
        
        .download-btn:hover {
          background: #2c8f4c;
          transform: translateY(-1px);
        }
        
        .reset-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .reset-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        
        .error-message {
          background: rgba(231, 76, 60, 0.2);
          border: 1px solid rgba(231, 76, 60, 0.3);
          color: #e74c3c;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        
        .error-message button {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        
        .error-message button:hover {
          background: #c0392b;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .title {
            font-size: 2.5rem;
          }
          
          .input-wrapper {
            flex-direction: column;
            gap: 10px;
          }
          
          .generate-btn {
            width: 100%;
            margin-left: 0;
            padding: 12px;
          }
          
          .result-actions {
            flex-direction: column;
          }
          
          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default Image_gen_prompt_Main