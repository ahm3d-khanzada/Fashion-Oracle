import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProfile, updateProfile, followUser } from '../../actions/profileActions';

const StyledContainer = styled(Container)`
  background-color: #000000;
  color: #ffffff;
  min-height: 100vh;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const ProfileImageWrapper = styled.div`
  width: 180px;
  height: 180px;
  margin: 0 auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(45deg, #34A85A, #FFC107);
    border-radius: 50%;
    z-index: 0;
  }
`;

const ProfileImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #000000;
  position: relative;
  z-index: 1;
`;

const Username = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const EditButton = styled(motion.button)`
  background: linear-gradient(45deg, #34A85A, #FFC107);
  border: none;
  color: #000000;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
  margin-left: 1rem;

  &:hover {
    opacity: 0.9;
  }
`;

const StatItem = styled(motion.div)`
  margin-right: 2rem;
  font-size: 1.1rem;

  strong {
    font-size: 1.3rem;
    font-weight: 600;
  }
`;

const Bio = styled.div`
  color: #d1d5db;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: linear-gradient(to right, #34A85A, #FFC107);
  margin: 2rem 0;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
`;

const PostItem = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const PostOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(52, 168, 90, 0.8), rgba(255, 193, 7, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: #121212;
    color: #ffffff;
    border: 1px solid #2d2d2d;
    border-radius: 12px;
  }

  .modal-header {
    border-bottom: 1px solid #2d2d2d;
    padding: 1.5rem;
  }

  .modal-footer {
    border-top: 1px solid #2d2d2d;
    padding: 1.5rem;
  }

  .form-control {
    background-color: #1f1f1f;
    border-color: #2d2d2d;
    color: #ffffff;
    border-radius: 8px;

    &:focus {
      background-color: #2d2d2d;
      border-color: #3d3d3d;
      box-shadow: 0 0 0 0.2rem rgba(52, 168, 90, 0.25);
    }
  }
`;

const Profile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();

  console.log('UserId from URL:', userId); // Debug userId
  console.log('Profile state:', useSelector(state => state.profile)); // Debug profile state

  const { profile, userPosts, loading, error } = useSelector(state => state.profile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    image: null,
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (userId === undefined) {
      // Fetch logged-in user's profile
      dispatch(fetchProfile());
    } else if (userId && !isNaN(parseInt(userId))) {
      // Fetch specific user's profile
      dispatch(fetchProfile(parseInt(userId)));
    } else {
      console.error('Invalid userId:', userId);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    setEditForm({
      bio: profile?.bio || '',
      image: null,
    });
  }, [profile]);

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setEditForm(prev => ({ ...prev, image: files[0] }));
      setFormError('');
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = { bio: editForm.bio };
    if (editForm.image) {
      formData.image = editForm.image;
    }
    dispatch(updateProfile(formData));
    setShowEditModal(false);
    setFormError('');
  };

  const handleFollow = () => {
    if (profile?.is_following) {
      dispatch(followUser(profile.user_id, 'unfollow'));
    } else {
      dispatch(followUser(profile.user_id, 'follow'));
    }
  };

  return (
    <StyledContainer fluid>
      <Container>
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}
        {loading && (
          <Alert variant="info">
            Loading profile...
          </Alert>
        )}
        {!loading && !error && !profile && (
          <Alert variant="warning">
            No profile data available. Please try again.
          </Alert>
        )}
        {profile && (
          <Row className="mb-5">
            <Col md={4} className="text-center mb-4 mb-md-0">
              <ProfileImageWrapper>
                <ProfileImage
                  src={profile?.image || 'http://localhost:8000/media/profile_pic/default.png'}
                  alt="Profile"
                  whileHover={{ scale: 1.05 }}
                />
              </ProfileImageWrapper>
            </Col>
            <Col md={8}>
              <div className="d-flex align-items-center flex-wrap mb-4">
                <Username>{profile?.username || 'Username'}</Username>
                {userId === undefined && (
                  <EditButton
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Profile
                  </EditButton>
                )}
                {userId && (
                  <Button
                    variant={profile?.is_following ? 'outline-secondary' : 'primary'}
                    onClick={handleFollow}
                    className="ms-2"
                  >
                    {profile?.is_following ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>

              <div className="d-flex mb-4">
                <StatItem whileHover={{ y: -2 }}>
                  <strong>{profile?.postsCount || 0}</strong> posts
                </StatItem>
                <StatItem whileHover={{ y: -2 }}>
                  <strong>{profile?.followersCount || 0}</strong> followers
                </StatItem>
                <StatItem whileHover={{ y: -2 }}>
                  <strong>{profile?.followingCount || 0}</strong> following
                </StatItem>
              </div>

              <Bio>
                <p className="mb-1 font-weight-bold">{profile?.fullName || 'Full Name'}</p>
                {profile?.bio ? (
                  profile.bio.split('\n').map((line, i) => (
                    <p key={i} className="mb-1">{line}</p>
                  ))
                ) : (
                  <p className="mb-1">No bio available</p>
                )}
              </Bio>
            </Col>
          </Row>
        )}

        <Divider />

        {profile && userPosts[profile?.user_id]?.length > 0 ? (
          <PostsGrid>
            {userPosts[profile?.user_id].map((post) => (
              <PostItem
                key={post.id}
                whileHover="hover"
                variants={{
                  hover: { scale: 1.03 }
                }}
              >
                <PostImage 
                  src={post.media || 'http://localhost:8000/media/posts/default.png'} 
                  alt={`Post ${post.id}`} 
                />
                <PostOverlay
                  variants={{
                    hover: { opacity: 1 }
                  }}
                >
                  <i className="fas fa-eye" style={{ color: 'white', fontSize: '2rem' }}></i>
                </PostOverlay>
              </PostItem>
            ))}
          </PostsGrid>
        ) : (
          <div className="text-center py-4">
            <h5 style={{ color: '#d1d5db' }}>No posts yet</h5>
            <p className="text-muted">When {profile?.username || 'this user'} shares photos or videos, they'll appear here.</p>
          </div>
        )}

        <AnimatePresence>
          {showEditModal && (
            <StyledModal
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {formError && <Alert variant="danger">{formError}</Alert>}
                <Form onSubmit={handleEditSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      name="image"
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="bio"
                      value={editForm.bio}
                      onChange={handleEditChange}
                      placeholder="Write something about yourself..."
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      onClick={() => setShowEditModal(false)}
                      className="me-2"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      style={{ 
                        background: 'linear-gradient(45deg, #34A85A, #FFC107)',
                        borderColor: '#2d2d2d'
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </StyledModal>
          )}
        </AnimatePresence>
      </Container>
    </StyledContainer>
  );
};

export default Profile;