"use client"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"

const NavContainer = styled.div`
  margin-bottom: 30px;
  border-bottom: 1px solid #dee2e6;
`

const NavList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
`

const NavItem = styled.li`
  margin-right: 5px;
`

const NavLink = styled(Link)`
  display: block;
  padding: 12px 20px;
  color: ${(props) => (props.active ? props.activeColor : "#6c757d")};
  text-decoration: none;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  position: relative;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${(props) => props.activeColor};
  }
`

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: ${(props) => props.color};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`

const TabNavigation = ({ tabs, activeTab, baseUrl, activeColor = "#34A85A" }) => {
  return (
    <NavContainer>
      <NavList>
        {tabs.map((tab) => (
          <NavItem key={tab.id}>
            <NavLink to={`${baseUrl}/${tab.path}`} active={activeTab === tab.id ? 1 : 0} activeColor={activeColor}>
              {tab.label}
              {activeTab === tab.id && (
                <ActiveIndicator
                  layoutId="activeTab"
                  color={activeColor}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  )
}

export default TabNavigation

