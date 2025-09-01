
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import { motion } from "framer-motion";
import BrowseDonations from "./BrowseDonations";
import MyRequests from "./MyRequests";
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

const doneeTabs = [
  { id: "browse", label: "Browse Donations", path: "browse" },
  { id: "requests", label: "My Requests", path: "requests" },
];

const DoneeDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("browse");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/requests")) {
      setActiveTab("requests");
    } else {
      setActiveTab("browse");
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
          <DashboardTitle>Donee Dashboard</DashboardTitle>
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatusBar userType="donee" activeTab={activeTab} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TabNavigation tabs={doneeTabs} activeTab={activeTab} baseUrl="/donation/donee" activeColor="#FFC107" />
        </motion.div>

        <ContentContainer variants={itemVariants} initial="hidden" animate="visible" key={activeTab}>
          {activeTab === "browse" && <BrowseDonations />}
          {activeTab === "requests" && <MyRequests />}
        </ContentContainer>
      </DashboardContainer>
    </Container>
  );
};

export default DoneeDashboard;