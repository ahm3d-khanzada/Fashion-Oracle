import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import CommunityBackground from '../Community_Background';
import CommunitySidebar from './Community_Sidebar';
import CommunityProfile from './Community_Profile';
import CommunityLayout from '../CommunityLayout';
import Community_Create from './Community_Create';
import Home_community from '../Home_community';
import Community_Search from './Community_Search';
import Community_Notification from '../Community_Notification';

const CommunityHome = () => {
  return (
    <CommunityLayout>
      <Routes>
        <Route path="/" element={<Home_community />} />
        <Route path="search" element={<Community_Search />} />
        <Route path="notifications" element={<Community_Notification />} />
        <Route path="create" element={<Community_Create />} />
        <Route path="profile/:userId" element={<CommunityProfile />} />
        <Route path="profile" element={<CommunityProfile />} />
        <Route path="*" element={<Navigate to="/community" replace />} />
      </Routes>
    </CommunityLayout>
  );
};

export default CommunityHome;