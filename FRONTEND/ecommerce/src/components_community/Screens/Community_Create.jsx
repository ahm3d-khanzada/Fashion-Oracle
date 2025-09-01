import React, { useState } from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Edit3 } from 'react-feather';
import CreatePost from '../Create_Post';

const GradientBackground = styled(motion.div)`
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  min-height: 100vh;
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto; 
`;

const StyledCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-left: 22rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 100%;
  max-width: 600px;
`;

const Title = styled(motion.h1)`
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const CreatePostButton = styled(motion.button)`
  background: linear-gradient(45deg, #34A85A, #FFC107);
  border: none;
  color: #000000;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 auto 2rem;

  svg {
    margin-right: 0.5rem;
  }
`;

const UploadArea = styled(motion.div)`
  border: 2px dashed #ffffff;
  border-radius: 50%;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 auto 2rem;
  overflow: hidden;
  position: relative;
`;

const UploadIcon = styled(motion.div)`
  color: #ffffff;
  font-size: 3rem;
`;

const CaptionInput = styled(motion.textarea)`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 10px;
  padding: 1rem;
  color: #ffffff;
  margin-bottom: 1rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`;

const PreviewCard = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 2rem;
`;

const PreviewImage = styled(motion.img)`
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const PreviewCaption = styled(motion.p)`
  color: #000000;
`;

const CreatePostScreen = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <GradientBackground
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <AnimatePresence>
          <StyledCard
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Title
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Create New Post
            </Title>
            <CreatePostButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreatePost(true)}
            >
              <Upload size={24} />
              Create New Post
            </CreatePostButton>

            <UploadArea
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            >
              {image ? (
                <PreviewImage
                  src={image}
                  alt="Uploaded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <UploadIcon
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 0, 270, 270, 0],
                    borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <Upload size={48} />
                </UploadIcon>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                style={{ display: 'none' }}
                id="file-input"
              />
            </UploadArea>

            <CaptionInput
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              initial={{ height: 100, opacity: 0 }}
              animate={{ height: caption ? 'auto' : 100, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {image && caption && (
              <PreviewCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Post Preview
                </motion.h3>
                <PreviewImage
                  src={image}
                  alt="Preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <PreviewCaption
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {caption}
                </PreviewCaption>
              </PreviewCard>
            )}
          </StyledCard>
        </AnimatePresence>
      </Container>

      <CreatePost 
        show={showCreatePost}
        onHide={() => setShowCreatePost(false)}
      />
    </GradientBackground>
  );
};

export default CreatePostScreen;

