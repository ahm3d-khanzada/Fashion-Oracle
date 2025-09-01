"use client"

import { useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f8f9fa;
`

const SlideImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
`

const SliderControls = styled.div`
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
`

const SliderDot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "white" : "rgba(255, 255, 255, 0.5)")};
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background-color: ${(props) => (props.active ? "white" : "rgba(255, 255, 255, 0.8)")};
  }
`

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const PrevButton = styled(NavButton)`
  left: 10px;
`

const NextButton = styled(NavButton)`
  right: 10px;
`

const PlaceholderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  color: #adb5bd;
`

const ImageSlider = ({ images = [], height = 300 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const placeholderImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUfP7Z__vRi63D6tkGBoUqzZLyjFrzTTHe0g&s"

  // Validate images array
  const validImages = images.filter(img => typeof img === "string" && img.trim() !== "")
  if (!validImages.length) {
    console.warn("ImageSlider: No valid images provided", images)
    return (
      <SliderContainer style={{ height: `${height}px` }}>
        <PlaceholderContainer>
          <img
            src={placeholderImage}
            alt="No image available"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </PlaceholderContainer>
      </SliderContainer>
    )
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? validImages.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === validImages.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex)
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  return (
    <SliderContainer style={{ height: `${height}px` }}>
      <AnimatePresence initial={false} custom={currentIndex}>
        <SlideImage
          key={currentIndex}
          src={validImages[currentIndex] || placeholderImage}
          alt={`Slide ${currentIndex + 1}`}
          custom={currentIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          onError={(e) => {
            console.error("ImageSlider: Failed to load image", validImages[currentIndex])
            e.target.src = placeholderImage
          }}
        />
      </AnimatePresence>

      <PrevButton onClick={goToPrevious} disabled={validImages.length <= 1}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </PrevButton>

      <NextButton onClick={goToNext} disabled={validImages.length <= 1}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </NextButton>

      {validImages.length > 1 && (
        <SliderControls>
          {validImages.map((_, slideIndex) => (
            <SliderDot key={slideIndex} active={slideIndex === currentIndex} onClick={() => goToSlide(slideIndex)} />
          ))}
        </SliderControls>
      )}
    </SliderContainer>
  )
}

export default ImageSlider