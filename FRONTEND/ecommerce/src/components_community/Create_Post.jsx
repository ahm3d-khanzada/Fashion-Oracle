import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Image, MapPin, Users, Settings, ChevronLeft } from 'lucide-react';
import { createPost } from '../actions/Create_Post_Actions';

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: #121212;
    color: #ffffff;
    border: 1px solid #2d2d2d;
    border-radius: 12px;
  }

  .modal-header {
    border-bottom: 1px solid #2d2d2d;
    padding: 1rem;
    align-items: center;
  }

  .modal-body {
    padding: 0;
  }
`;

const UploadArea = styled.div`
  background-color: #1a1a1a;
  border: 2px dashed #333;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #666;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
`;

const PostSettings = styled.div`
  padding: 1rem;
  border-top: 1px solid #2d2d2d;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  color: #fff;
  cursor: pointer;
  
  &:not(:last-child) {
    border-bottom: 1px solid #2d2d2d;
  }

  svg {
    margin-right: 0.75rem;
  }
`;

const CreatePost = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.createPost);

  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    setImage(file);
    setStep(2);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

// Update the handleShare function in Create_Post.jsx
const handleShare = async () => {
  try {
    const formData = new FormData();
    formData.append('media', image);  // Changed from 'image' to 'media' to match backend
    formData.append('caption', caption);
    await dispatch(createPost(formData));
  } catch (error) {
    // Error is already handled in the action, but you can add additional handling here
    console.error('Post creation error:', error);
  }
};

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onHide();
    }
  };

  React.useEffect(() => {
    if (success) {
      onHide();
      setStep(1);
      setImage(null);
      setCaption('');
    }
  }, [success, onHide]);

  return (
    <StyledModal
      show={show}
      onHide={onHide}
      centered
      size={step === 1 ? "md" : "lg"}
    >
      <Modal.Header>
        <Button
          variant="link"
          className="text-white p-0 me-3"
          onClick={handleBack}
        >
          <ChevronLeft size={24} />
        </Button>
        <Modal.Title className="fs-6 m-0">
          {step === 1 ? 'Create new post' : step === 2 ? 'Crop' : 'Create new post'}
        </Modal.Title>
        {step === 3 && (
          <Button
            className="ms-auto"
            style={{
              background: 'linear-gradient(45deg, #34A85A, #FFC107)',
              border: 'none'
            }}
            onClick={handleShare}
            disabled={loading}
          >
            {loading ? 'Sharing...' : 'Share'}
          </Button>
        )}
      </Modal.Header>

      <Modal.Body>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {step === 1 && (
          <div className="p-4">
            <UploadArea {...getRootProps()}>
              <input {...getInputProps()} />
              <Image size={48} className="mb-3 text-muted" />
              <h5>Drag photos and videos here</h5>
              <Button
                style={{
                  background: 'linear-gradient(45deg, #34A85A, #FFC107)',
                  border: 'none'
                }}
              >
                Select from computer
              </Button>
            </UploadArea>
          </div>
        )}

        {(step === 2 || step === 3) && (
          <div className="d-flex">
            <div className="flex-grow-1" style={{ maxWidth: '60%' }}>
              <ImagePreview src={URL.createObjectURL(image)} alt="Preview" />
            </div>
            {step === 3 && (
              <div className="flex-grow-1" style={{ maxWidth: '40%' }}>
                <Form.Group className="p-3">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white'
                    }}
                  />
                </Form.Group>
                <PostSettings>
                  <SettingItem>
                    <MapPin size={20} />
                    Add location
                  </SettingItem>
                  <SettingItem>
                    <Users size={20} />
                    Add collaborators
                  </SettingItem>
                  <SettingItem>
                    <Settings size={20} />
                    Advanced settings
                  </SettingItem>
                </PostSettings>
              </div>
            )}
          </div>
        )}
      </Modal.Body>

      {step === 2 && (
        <Modal.Footer style={{ borderTop: '1px solid #2d2d2d' }}>
          <Button
            style={{
              background: 'linear-gradient(45deg, #34A85A, #FFC107)',
              border: 'none'
            }}
            onClick={() => setStep(3)}
          >
            Next
          </Button>
        </Modal.Footer>
      )}
    </StyledModal>
  );
};

export default CreatePost;

