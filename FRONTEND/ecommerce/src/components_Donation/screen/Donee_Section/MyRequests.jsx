import React, { useState, useEffect } from "react";
import { Row, Col, Badge, Button, Alert, Spinner, Form, Modal } from "react-bootstrap";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import ImageSlider from "../../ImageSlider";
import EmptyState from "../../EmptyState";
import {
  listUserDonationRequests,
  deleteDonationRequest,
  updateDonationRequest,
} from "../../../actions/donationActions";
import { DONATION_REQUEST_UPDATE_RESET, DONATION_REQUEST_DELETE_RESET } from "../../../constants/donationConstants";
import AuthCheck from "../../AuthCheck";
import ConfirmationModal from "../../ConfirmationModal";

const RequestsContainer = styled(motion.div)`
  margin-bottom: 30px;
`;

const RequestsTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 25px;
  font-weight: bold;
`;

const RequestCard = styled(motion.div)`
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #dee2e6;
`;

const StatusBadge = styled(Badge)`
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 20px;
`;

const RequestInfo = styled.div`
  padding: 20px;
`;

const RequestTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DonorInfo = styled.p`
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

const InfoSection = styled.div`
  margin-bottom: 15px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  .label {
    font-size: 0.8rem;
    color: #6c757d;
    margin-bottom: 2px;
  }
  .value {
    font-size: 1rem;
    font-weight: 500;
  }
`;

const ContactSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
`;

const ContactTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  svg {
    margin-right: 10px;
    width: 20px;
  }
`;

const RequestDate = styled.div`
  color: #6c757d;
  font-size: 0.85rem;
  margin-top: 15px;
  display: flex;
  align-items: center;
  svg {
    margin-right: 5px;
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin-right: 5px;
  }
`;

const EditButton = styled(ActionButton)`
  background-color: #17a2b8;
  border-color: #17a2b8;
  &:hover {
    background-color: #138496;
    border-color: #138496;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #dc3545;
  border-color: #dc3545;
  &:hover {
    background-color: #c82333;
    border-color: #c82333;
  }
`;

const ModalTitle = styled(Modal.Title)`
  font-weight: bold;
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: 20px;
`;

const FormLabel = styled(Form.Label)`
  font-weight: 500;
  margin-bottom: 8px;
`;

const FormControl = styled(Form.Control)`
  &:focus {
    border-color: #FFC107;
    box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  }
`;

const FormSelect = styled(Form.Select)`
  &:focus {
    border-color: #FFC107;
    box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #FFC107;
  border-color: #FFC107;
  width: 100%;
  font-weight: 500;
  &:hover {
    background-color: #e6af06;
    border-color: #e6af06;
  }
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  }
`;

const MyRequests = () => {
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin || {});
  const { userInfo } = userSignin;

  const donationRequestList = useSelector((state) => state.donationRequestList || {});
  const { loading, error, requests = [] } = donationRequestList;

  const donationRequestDelete = useSelector((state) => state.donationRequestDelete || {});
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = donationRequestDelete;

  const donationRequestUpdate = useSelector((state) => state.donationRequestUpdate || {});
  const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = donationRequestUpdate;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRequestData, setEditRequestData] = useState({
    request_reason: "",
    additional_info: "",
    phone_no: "",
  });
  const [editRequestId, setEditRequestId] = useState(null);

  useEffect(() => {
    if (userInfo) {
      dispatch(listUserDonationRequests());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successDelete) {
      setShowDeleteModal(false);
      setRequestToDelete(null);
      setTimeout(() => {
        dispatch({ type: DONATION_REQUEST_DELETE_RESET });
        dispatch(listUserDonationRequests());
      }, 1000);
    }
  }, [successDelete, dispatch]);

  useEffect(() => {
    if (successUpdate) {
      setShowEditModal(false);
      setEditRequestId(null);
      setEditRequestData({
        request_reason: "",
        additional_info: "",
        phone_no: "",
      });
      setTimeout(() => {
        dispatch({ type: DONATION_REQUEST_UPDATE_RESET });
        dispatch(listUserDonationRequests());
      }, 1000);
    }
  }, [successUpdate, dispatch]);

  const handleEdit = (request) => {
    setEditRequestId(request.id);
    setEditRequestData({
      request_reason: request.request_reason || "",
      additional_info: request.additional_info || "",
      phone_no: request.phone_no || userInfo?.phone || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = (request) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (requestToDelete) {
      dispatch(deleteDonationRequest(requestToDelete.id));
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRequestData({
      ...editRequestData,
      [name]: value,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editRequestId) {
      dispatch(updateDonationRequest(editRequestId, editRequestData));
    }
  };

  const getReasonDisplay = (reason) => {
    const reasonMap = {
      personal_need: "Personal Need",
      family_need: "Family Need",
      community_program: "Community Program",
      homeless_shelter: "Homeless Shelter",
      disaster_relief: "Disaster Relief",
      others: "Other",
    };
    return reasonMap[reason] || reason;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } },
  };

  if (!userInfo) {
    return <Alert variant="warning">Please log in to view your requests.</Alert>;
  }

  return (
    <AuthCheck>
      <RequestsContainer variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <RequestsTitle>My Requested Donations</RequestsTitle>
        </motion.div>

        {(error || errorDelete || errorUpdate) && (
          <Alert variant="danger" className="mb-3">
            {error || errorDelete || errorUpdate}
          </Alert>
        )}

        {(successDelete || successUpdate) && (
          <Alert variant="success" className="mb-3">
            {successDelete ? "Request deleted successfully!" : "Request updated successfully!"}
          </Alert>
        )}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading your requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            }
            title="No Requested Donations Yet"
            description="Browse available donations and make a request to see your requests here."
            action = "Browse Donations"
            onAction={() => (window.location.href = "/donation/donee/browse")}
            iconColor="#FFC107"
            buttonColor="#FFC107"
          />
        ) : (
          <AnimatePresence>
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <Row>
                  <Col md={5}>
                    <ImageSlider images={request.donation.images || []} height={300} />
                  </Col>
                  <Col md={7}>
                    <RequestInfo>
                      <RequestTitle>
                        {request.donation.category || "Unknown Item"}
                        <StatusBadge
                          bg={
                            request.status === "approved"
                              ? "success"
                              : request.status === "rejected"
                              ? "danger"
                              : request.status === "full_filled"
                              ? "info"
                              : "warning"
                          }
                        >
                          {request.status === "approved"
                            ? "Approved"
                            : request.status === "rejected"
                            ? "Rejected"
                            : request.status === "full_filled"
                            ? "Fulfilled"
                            : "Pending"}
                        </StatusBadge>
                      </RequestTitle>

                      <DonorInfo>
                        Donor: {request.donation.anonymous ? "Anonymous" : request.donation.full_name || "Unknown"}
                      </DonorInfo>

                      <InfoSection>
                        <InfoGrid>
                          <InfoItem>
                            <div className="label">Category</div>
                            <div className="value">{request.donation.category || "N/A"}</div>
                          </InfoItem>
                          <InfoItem>
                            <div className="label">Quantity</div>
                            <div className="value">{request.donation.quantity || "N/A"}</div>
                          </InfoItem>
                          <InfoItem>
                            <div className="label">Size</div>
                            <div className="value">{request.donation.size || "N/A"}</div>
                          </InfoItem>
                        </InfoGrid>
                      </InfoSection>

                      <InfoSection>
                        <div className="label">Reason for Request:</div>
                        <div className="value">{getReasonDisplay(request.request_reason) || "N/A"}</div>
                      </InfoSection>

                      <InfoSection>
                        <div className="label">Additional Information:</div>
                        <div className="value">{request.additional_info || "None provided"}</div>
                      </InfoSection>

                      {request.status === "approved" && !request.donation.isAnonymous && (
                        <ContactSection>
                          <ContactTitle>Contact Information:</ContactTitle>
                          {request.donation.email && (
                            <ContactItem>
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
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                              {request.donation.email}
                            </ContactItem>
                          )}
                          {request.donation.phoneNo && (
                            <ContactItem>
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
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                              {request.donation.phoneNo}
                            </ContactItem>
                          )}
                          {request.donation.pickupAddress && (
                            <ContactItem>
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
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              {request.donation.pickupAddress}
                            </ContactItem>
                          )}
                        </ContactSection>
                      )}

                      <RequestDate>
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
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Requested on {new Date(request.created_at).toLocaleDateString()}
                      </RequestDate>

                      {request.status === "pending" && (
                        <ActionButtonsContainer>
                          <EditButton
                            onClick={() => handleEdit(request)}
                            disabled={loadingUpdate || loadingDelete}
                          >
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
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit Request
                          </EditButton>
                          <DeleteButton
                            onClick={() => handleDelete(request)}
                            disabled={loadingUpdate || loadingDelete}
                          >
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
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Delete Request
                          </DeleteButton>
                        </ActionButtonsContainer>
                      )}
                    </RequestInfo>
                  </Col>
                </Row>
              </RequestCard>
            ))}
          </AnimatePresence>
        )}

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered backdrop="static">
          <Modal.Header closeButton>
            <ModalTitle>Edit Request</ModalTitle>
          </Modal.Header>
          <Modal.Body>
            {errorUpdate && (
              <Alert variant="danger" className="mb-3">
                {errorUpdate}
              </Alert>
            )}
            <Form onSubmit={handleEditSubmit}>
              <FormGroup>
                <FormLabel>Why do you need this donation?</FormLabel>
                <FormSelect
                  name="request_reason"
                  value={editRequestData.request_reason}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="personal_need">Personal Need</option>
                  <option value="family_need">Family Need</option>
                  <option value="community_program">Community Program</option>
                  <option value="homeless_shelter">Homeless Shelter</option>
                  <option value="disaster_relief">Disaster Relief</option>
                  <option value="others">Other</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Additional Information</FormLabel>
                <FormControl
                  as="textarea"
                  rows={3}
                  name="additional_info"
                  value={editRequestData.additional_info}
                  onChange={handleEditChange}
                  placeholder="Please provide more details about your request"
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Your Phone Number</FormLabel>
                <FormControl
                  type="tel"
                  name="phone_no"
                  value={editRequestData.phone_no}
                  onChange={handleEditChange}
                  placeholder="Enter your phone number"
                  required
                />
              </FormGroup>
              <div className="d-grid gap-2">
                <SubmitButton type="submit" disabled={loadingUpdate}>
                  {loadingUpdate ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Updating...
                    </>
                  ) : (
                    "Update Request"
                  )}
                </SubmitButton>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <ConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Request"
          message="Are you sure you want to delete this request? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="#dc3545"
          confirmHoverColor="#c82333"
          iconColor="#dc3545"
          isLoading={loadingDelete}
          icon={
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          }
        />
      </RequestsContainer>
    </AuthCheck>
  );
};

export default MyRequests;