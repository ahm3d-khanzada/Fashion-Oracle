"use client"

import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
`

const Star = styled(motion.div)`
  cursor: ${(props) => (props.readonly ? "default" : "pointer")};
  color: ${(props) => (props.filled ? "#FFC107" : "#e4e5e9")};
  font-size: ${(props) => props.size || "24px"};

  svg {
    width: 1em;
    height: 1em;
  }
`

const RatingText = styled.span`
  font-size: 0.9rem;
  color: #6c757d;
  margin-left: 5px;
`

const RatingStars = ({ rating = 0, maxRating = 5, onChange, readonly = false, showText = true, size = "24px" }) => {
  const [hoverRating, setHoverRating] = useState(0)

  const handleStarClick = (selectedRating) => {
    if (readonly) {
      return
    }
    if (onChange) {
      onChange(selectedRating)
    }
  }

  const handleStarHover = (hoveredRating) => {
    if (readonly) {
      return
    }
    setHoverRating(hoveredRating)
  }

  const handleMouseLeave = () => {
    if (readonly) {
      return
    }
    setHoverRating(0)
  }

  // Format rating to display with one decimal place if needed
  const formattedRating = rating % 1 === 0 ? rating : rating.toFixed(1)

  return (
    <RatingContainer>
      <StarsContainer onMouseLeave={handleMouseLeave}>
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1
          const isActive = hoverRating ? starValue <= hoverRating : starValue <= rating

          return (
            <Star
              key={index}
              filled={isActive}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              readonly={readonly}
              size={size}
// sourcery skip: invert-ternary
              whileHover={!readonly ? { scale: 1.2 } : {}}
              whileTap={!readonly ? { scale: 0.9 } : {}}
            >
              <svg
                viewBox="0 0 24 24"
                fill={isActive ? "currentColor" : "none"}
                stroke={isActive ? "none" : "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </Star>
          )
        })}
      </StarsContainer>

      {showText && (
        <RatingText>
          {formattedRating} / {maxRating}
        </RatingText>
      )}
    </RatingContainer>
  )
}

export default RatingStars

