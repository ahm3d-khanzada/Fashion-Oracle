"use client"
import styled from "styled-components"
import { motion } from "framer-motion"

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const ToggleTrack = styled.div`
  width: 50px;
  height: 24px;
  background-color: ${(props) => (props.isActive ? props.activeColor : "#e0e0e0")};
  border-radius: 34px;
  padding: 2px;
  transition: background-color 0.3s;
  position: relative;
  margin-right: 10px;
`

const ToggleThumb = styled(motion.div)`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

const ToggleLabel = styled.span`
  font-size: 14px;
  user-select: none;
`

const ToggleSwitch = ({ isActive, onToggle, label, activeColor = "#34A85A", id }) => {
  return (
    <ToggleContainer onClick={onToggle}>
      <ToggleTrack isActive={isActive} activeColor={activeColor}>
        <ToggleThumb
          initial={false}
          animate={{
            x: isActive ? 26 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </ToggleTrack>
      <ToggleLabel>{label}</ToggleLabel>
    </ToggleContainer>
  )
}

export default ToggleSwitch

