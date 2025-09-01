"use client"

import { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import { Form, Alert, Spinner } from "react-bootstrap"
import { motion, AnimatePresence } from "framer-motion"

const UploadContainer = styled.div`
  margin-bottom: 20px;
`

const UploadLabel = styled(Form.Label)`
  font-weight: 500;
  margin-bottom: 8px;
`

const UploadInput = styled(Form.Control)`
  display: none;
`

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`

const PreviewItem = styled(motion.div)`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`

const PreviewImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
`

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #dc3545;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 5;

  &:hover {
    background-color: #c82333;
  }
`

const UploadPlaceholder = styled.div`
  width: 100%;
  padding: 30px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #34A85A;
    background-color: rgba(52, 168, 90, 0.05);
  }
`

const PlaceholderIcon = styled.div`
  margin-bottom: 15px;
  color: #adb5bd;
`

const PlaceholderText = styled.div`
  color: #6c757d;
  text-align: center;
`

const HelpText = styled(Form.Text)`
  display: block;
  margin-top: 8px;
`

const ErrorContainer = styled(Alert)`
  margin-top: 10px;
  font-size: 0.9rem;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`

const FileUpload = ({
  label = "Upload Files",
  accept = "image/*",
  multiple = true,
  maxFiles = 10,
  minFiles = 0,
  maxFileSize = 5, // in MB
  helpText = "",
  onChange,
  value = [],
  isUploading = false,
  uploadError = null,
}) => {
  const [previewUrls, setPreviewUrls] = useState([])
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (uploadError) {
      setError(uploadError)
    }
  }, [uploadError])

  useEffect(() => {
    if (value.length > 0) {
      const urls = value.map((item) => {
        if (typeof item === "string") return item;
        if (item instanceof File) return URL.createObjectURL(item);
        return "";
      });
      setPreviewUrls(urls);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const validateFiles = (files) => {
    if (files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`)
      return false
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > maxFileSize) {
        setError(`File "${file.name}" exceeds the maximum size of ${maxFileSize}MB.`)
        return false
      }
    }

    const acceptedTypes = accept.split(",").map((type) => type.trim())
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileType = file.type

      if (accept === "image/*" && !fileType.startsWith("image/")) {
        setError(`File "${file.name}" is not an image.`)
        return false
      } else if (accept !== "image/*" && !acceptedTypes.includes(fileType)) {
        setError(`File "${file.name}" has an unsupported format.`)
        return false
      }
    }

    setError(null)
    return true
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)

    if (selectedFiles.length === 0) {
      return
    }

    if (!validateFiles(selectedFiles)) {
      e.target.value = null
      return
    }

    const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls])

    if (onChange) {
      onChange(selectedFiles)
    }
  }

  const handleRemoveFile = (index) => {
    setPreviewUrls((prevUrls) => {
      const newUrls = [...prevUrls]
      URL.revokeObjectURL(newUrls[index])
      newUrls.splice(index, 1)
      return newUrls
    })

    if (onChange) {
      const newFiles = [...value]
      newFiles.splice(index, 1)
      onChange(newFiles)
    }
  }

  const handleDragPlaceholderClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)

      if (!validateFiles(droppedFiles)) {
        return
      }

      const newPreviewUrls = droppedFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls])

      if (onChange) {
        onChange(droppedFiles)
      }
    }
  }

  return (
    <UploadContainer>
      <UploadLabel>{label}</UploadLabel>

      <UploadInput
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        required={minFiles > 0 && previewUrls.length < minFiles}
      />

      {previewUrls.length === 0 ? (
        <UploadPlaceholder onClick={handleDragPlaceholderClick} onDragOver={handleDragOver} onDrop={handleDrop}>
          <PlaceholderIcon>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </PlaceholderIcon>
          <PlaceholderText>Click to browse or drag and drop files here</PlaceholderText>
        </UploadPlaceholder>
      ) : null}

      {helpText && <HelpText className="text-muted">{helpText}</HelpText>}

      {error && (
        <ErrorContainer variant="danger">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: "8px" }}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </ErrorContainer>
      )}

      <AnimatePresence>
        {previewUrls.length > 0 && (
          <PreviewContainer>
            {previewUrls.map((url, index) => (
              <PreviewItem
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <PreviewImage style={{ backgroundImage: `url(${url})` }} />
                {isUploading && (
                  <LoadingOverlay>
                    <Spinner animation="border" variant="light" size="sm" />
                  </LoadingOverlay>
                )}
                <RemoveButton onClick={() => handleRemoveFile(index)} disabled={isUploading}>
                  ×
                </RemoveButton>
              </PreviewItem>
            ))}
          </PreviewContainer>
        )}
      </AnimatePresence>
    </UploadContainer>
  )
}

export default FileUpload