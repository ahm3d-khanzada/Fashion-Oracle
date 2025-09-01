import React from 'react';
import styled from 'styled-components';
import CommunityBackground from './Community_Background';
import CommunitySidebar from './Screens/Community_Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  position: relative;
  min-height: 100vh;
  background-color: #000;
`;

const MainContent = styled.main`
  flex-grow: 1;
  margin-left: 280px;
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-bottom: 60px;
  }
`;

const SidebarWrapper = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 280px;
  z-index: 100;
`;

const CommunityLayout = ({ children }) => {
  return (
      <LayoutContainer>
        <CommunityBackground />
        <SidebarWrapper>
          <CommunitySidebar/>
        </SidebarWrapper>
        <MainContent>
          {children}
        </MainContent>
      </LayoutContainer>
  );
};

export default CommunityLayout;
