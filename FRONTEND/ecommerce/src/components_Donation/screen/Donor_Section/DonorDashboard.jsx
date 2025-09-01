"use client"

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import { motion } from "framer-motion";
import DonateItems from "./DonateItems";
import DonationRequests from "./DonationRequests";
import StatusBar from "../../StatusBar";
import TabNavigation from "../../TabNavigation";

const DashboardContainer = styled(motion.div)`
  padding: 20px 0;
`;

const BackButton = styled(Link)`
  color: #333;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 30px;
  font-weight: bold;
`;

const ContentContainer = styled(motion.div)`
  margin-top: 20px;
`;

const donorTabs = [
  { id: "donate", label: "Donate Items", path: "donate" },
  { id: "requests", label: "Donation Requests", path: "requests" },
];

const DonorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("donate");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/requests")) {
      setActiveTab("requests");
    } else {
      setActiveTab("donate");
    }
  }, [location]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Container>
      <DashboardContainer variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <BackButton to="/donation">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </BackButton>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DashboardTitle>Donor Dashboard</DashboardTitle>
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatusBar userType="donor" activeTab={activeTab} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TabNavigation tabs={donorTabs} activeTab={activeTab} baseUrl="/donation/donor" activeColor="#34A85A" />
        </motion.div>

        <ContentContainer variants={itemVariants} initial="hidden" animate="visible" key={activeTab}>
          {activeTab === "donate" && <DonateItems />}
          {activeTab === "requests" && <DonationRequests />}
        </ContentContainer>
      </DashboardContainer>
    </Container>
  );
};

export default DonorDashboard;