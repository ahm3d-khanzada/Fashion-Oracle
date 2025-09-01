"use client"

import { Card, Row, Col } from "react-bootstrap"
import styled from "styled-components"
import RatingStars from "./RatingStars"

const ProfileCard = styled(Card)`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`

const ProfileHeader = styled(Card.Header)`
  background-color: ${(props) => (props.isVerified ? "#34A85A" : "#f8f9fa")};
  color: ${(props) => (props.isVerified ? "white" : "inherit")};
  padding: 15px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ProfileBody = styled(Card.Body)`
  padding: 20px;
`

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f8f9fa;
  background-image: url(${(props) => props.src || "/placeholder.svg?height=80&width=80"});
  background-size: cover;
  background-position: center;
  margin-right: 20px;
`

const ProfileInfo = styled.div`
  flex: 1;
`

const ProfileName = styled.h4`
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  
  svg {
    width: 18px;
    height: 18px;
    margin-left: 8px;
    color: ${(props) => (props.isVerified ? "#34A85A" : "#6c757d")};
  }
`

const ProfileStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
`

const StatItem = styled.div`
  text-align: center;
  min-width: 80px;
  
  .value {
    font-size: 1.2rem;
    font-weight: 600;
    color: #343a40;
  }
  
  .label {
    font-size: 0.8rem;
    color: #6c757d;
  }
`

const UserProfile = ({ user = {}, showStats = true, isCompact = false }) => {
  const {
    name = "User Name",
    profileImage = null,
    isVerified = false,
    rating = 0,
    donationsCount = 0,
    requestsCount = 0,
    joinedDate = "January 2023",
  } = user

  // Determine if user is a premium verified user (rating 4.6-5.0)
  const isPremiumVerified = isVerified && rating >= 4.6 && rating <= 5.0

  return (
    <ProfileCard>
      <ProfileHeader isVerified={isPremiumVerified}>
        {isPremiumVerified ? (
          <>
            <span>Premium Verified User</span>
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </>
        ) : (
          <>
            <span>User Profile</span>
            {isVerified && (
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </>
        )}
      </ProfileHeader>

      <ProfileBody>
        <Row>
          <Col xs={12} className="d-flex">
            {!isCompact && <ProfileImage src={profileImage} />}

            <ProfileInfo>
              <ProfileName isVerified={isVerified}>
                {name}
                {isVerified && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )}
              </ProfileName>

              <RatingStars
                rating={rating}
                readonly={true}
                showText={true}
                size={isCompact ? "16px" : "20px"}
                isVerified={isVerified}
              />

              {!isCompact && (
                <div className="text-muted mt-2">
                  <small>Member since {joinedDate}</small>
                </div>
              )}
            </ProfileInfo>
          </Col>
        </Row>

        {showStats && !isCompact && (
          <ProfileStats>
            <StatItem>
              <div className="value">{donationsCount}</div>
              <div className="label">Donations</div>
            </StatItem>

            <StatItem>
              <div className="value">{requestsCount}</div>
              <div className="label">Requests</div>
            </StatItem>

            <StatItem>
              <div className="value">{rating.toFixed(1)}</div>
              <div className="label">Rating</div>
            </StatItem>
          </ProfileStats>
        )}
      </ProfileBody>
    </ProfileCard>
  )
}

export default UserProfile

