import React, { useEffect, useState } from "react";
import { Row, Col, Badge, Button, Alert, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { listDonorDonationRequests, updateDonationRequest, getDoneeRatings, submitDoneeRating } from "../../../actions/donationActions";
import ImageSlider from "../../ImageSlider";
import EmptyState from "../../EmptyState";
import RatingModal from "../../RatingModal";
import RatingStars from "../../RatingStars";

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

const RequestSection = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ActionButton = styled(Button)`
  width: 100%;
  padding: 10px;
  font-weight: 500;
`;

const ApproveButton = styled(ActionButton)`
  background-color: #34A85A;
  border-color: #34A85A;
  
  &:hover {
    background-color: #2d9650;
    border-color: #2d9650;
  }
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`;

const RejectButton = styled(ActionButton)`
  background-color: white;
  border-color: #dc3545;
  color: #dc3545;
  
  &:hover {
    background-color: #dc3545;
    color: white;
  }
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
  }
`;

const RateButton = styled(ActionButton)`
  background-color: #FFC107;
  border-color: #FFC107;
  
  &:hover {
    background-color: #e6af06;
    border-color: #e6af06;
  }
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  }
`;

const RatingSection = styled(RequestSection)`
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
`;

const RatingText = styled.p`
  margin: 5px 0;
  font-size: 0.9rem;
`;

const DonationRequests = () => {
  const dispatch = useDispatch();

  // Get donation requests and update state from Redux
  const donationRequestList = useSelector((state) => state.donationRequestList || {});
  const { loading: loadingList, requests = [], error: errorList } = donationRequestList;

  const donationRequestUpdate = useSelector((state) => state.donationRequestUpdate || {});
  const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = donationRequestUpdate;

  const doneeRatingsList = useSelector((state) => state.doneeRatingsList || {});
  const { loading: loadingRatings, error: errorRatings } = doneeRatingsList;

  const doneeRatingSubmit = useSelector((state) => state.doneeRatingSubmit || {});
  const { loading: loadingRatingSubmit, success: successRatingSubmit, error: errorRatingSubmit } = doneeRatingSubmit;

  // State for ratings and modal
  const [doneeRatings, setDoneeRatings] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [doneeToRate, setDoneeToRate] = useState(null);

  // Fetch donation requests
  useEffect(() => {
    dispatch(listDonorDonationRequests());
  }, [dispatch]);

  // Fetch ratings for each donee when requests are loaded
  useEffect(() => {
    if (requests.length > 0) {
      requests.forEach((request) => {
        console.log("Request:", request);
      console.log("Donee ID:", request.donee);
        if (request.donee && !doneeRatings[request.donee]) {
          dispatch(getDoneeRatings(request.donee))
            .then((action) => {
              if (action && action.type === "DONEE_RATINGS_LIST_SUCCESS") {
                setDoneeRatings((prev) => ({
                  ...prev,
                  [request.donee]: action.payload || [], // Default to empty array if no ratings
                }));
              } else {
                setDoneeRatings((prev) => ({
                  ...prev,
                  [request.donee]: [], // Default to empty array on failure
                }));
              }
            })
            .catch((error) => {
              console.error("Error fetching ratings:", error);
              setDoneeRatings((prev) => ({
                ...prev,
                [request.donee]: [], // Default to empty array on error
              }));
            });
        }
      });
    }
  }, [requests, dispatch, doneeRatings]);

  // Refresh requests after update or rating submission
  useEffect(() => {
    if (successUpdate || successRatingSubmit) {
      dispatch(listDonorDonationRequests());
    }
  }, [successUpdate, successRatingSubmit, dispatch]);

  const handleApprove = (requestId) => {
    dispatch(updateDonationRequest(requestId, { status: "approved" }))
      .then(() => {
        // Optionally show success message
      })
      .catch((error) => {
        console.error("Failed to approve request:", error);
      });
  };

  const handleReject = (requestId) => {
    dispatch(updateDonationRequest(requestId, { status: "rejected", reason: "Request not suitable" }))
      .then(() => {
        // Optionally show success message
      })
      .catch((error) => {
        console.error("Failed to reject request:", error);
      });
  };

  const handleRateDonee = (request) => {
    setDoneeToRate({ id: request.donee, name: request.full_name });
    setShowRatingModal(true);
  };

  const handleSubmitRating = (ratingData) => {
    if (doneeToRate) {
      dispatch(submitDoneeRating(doneeToRate.id, {
        score: ratingData.rating,
        comment: ratingData.comment,
      }))
        .then((action) => {
          if (action && action.type === "DONEE_RATING_SUBMIT_SUCCESS") {
            setShowRatingModal(false);
            setDoneeToRate(null);
            alert(`Rating of ${ratingData.rating} stars submitted successfully for ${doneeToRate.name}!`);
            // Refresh ratings for the donee
            dispatch(getDoneeRatings(doneeToRate.id)).then((action) => {
              if (action && action.type === "DONEE_RATINGS_LIST_SUCCESS") {
                setDoneeRatings((prev) => ({
                  ...prev,
                  [doneeToRate.id]: action.payload || [],
                }));
              }
            });
          }
        })
        .catch((error) => {
          console.error("Failed to submit rating:", error);
          alert("Failed to submit rating. Please try again.");
        });
    }
  };

  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.score, 0);
    return total / ratings.length;
  };

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.2 },
    },
  };

  return (
    <RequestsContainer variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <RequestsTitle>Donation Requests</RequestsTitle>
      </motion.div>

      {(errorList || errorUpdate || errorRatingSubmit || errorRatings) && (
        <Alert variant="danger" className="mb-3">
          {errorList || errorUpdate || errorRatingSubmit || errorRatings}
        </Alert>
      )}

      {loadingList ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading donation requests...</p>
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
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          }
          title="No Donation Requests Yet"
          description="When someone requests your donations, they will appear here. Check back later or donate more items to increase your visibility."
          actionText="Donate More Items"
          onAction={() => (window.location.href = "/donation/donor/donate")}
          iconColor="#34A85A"
          buttonColor="#34A85A"
        />
      ) : (
        <AnimatePresence>
          {requests.map((request) => (
            <RequestCard key={request.id} variants={cardVariants} initial="hidden" animate="visible" exit="exit" layout>
              <Row>
                <Col md={5}>
                  <ImageSlider images={request.donation.images || []} height={300} />
                </Col>
                <Col md={7}>
                  <RequestInfo>
                    <RequestTitle>
                      {request.donation.cloth_type}
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
                    <RequestSection>
                      <SectionTitle>Requested By:</SectionTitle>
                      <p>{request.full_name}</p>
                    </RequestSection>
                    <RequestSection>
                      <SectionTitle>Reason:</SectionTitle>
                      <p>{request.request_reason}</p>
                    </RequestSection>
                    <RequestSection>
                      <SectionTitle>Additional Information:</SectionTitle>
                      <p>{request.additional_info || "No additional information provided."}</p>
                    </RequestSection>
                    <RequestSection>
                      <SectionTitle>Contact:</SectionTitle>
                      <p>{request.phone_no}</p>
                    </RequestSection>
                    <RatingSection>
                      <SectionTitle>Donee Rating:</SectionTitle>
                      {loadingRatings ? (
                        <Spinner animation="border" size="sm" />
                      ) : doneeRatings[request.donee] && doneeRatings[request.donee].length > 0 ? (
                        <>
                          <RatingStars
                            rating={calculateAverageRating(doneeRatings[request.donee])}
                            readonly={true}
                            showText={true}
                            size="24px"
                          />
                          {doneeRatings[request.donee].map((rating) => (
                            <RatingText key={rating.id}>
                              {rating.score} stars - {rating.comment || "No comment"} (by {rating.reviewer})
                            </RatingText>
                          ))}
                        </>
                      ) : (
                        <RatingText>No ratings yet for this donee.</RatingText>
                      )}
                    </RatingSection>
                    <div className="text-muted mb-3">
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
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Requested on {new Date(request.created_at).toLocaleDateString()}
                    </div>
                    {request.status === "pending" ? (
                      <Row>
                        <Col>
                          <ApproveButton
                            onClick={() => handleApprove(request.id)}
                            disabled={loadingUpdate}
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
                              style={{ marginRight: "8px" }}
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            Approve
                          </ApproveButton>
                        </Col>
                        <Col>
                          <RejectButton
                            onClick={() => handleReject(request.id)}
                            disabled={loadingUpdate}
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
                              style={{ marginRight: "8px" }}
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="15" y1="9" x2="9" y2="15"></line>
                              <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            Reject
                          </RejectButton>
                        </Col>
                      </Row>
                    ) : request.status === "approved" && (
                      <Row>
                        <Col>
                          <RateButton
                            onClick={() => handleRateDonee(request)}
                            disabled={loadingRatingSubmit}
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
                              style={{ marginRight: "8px" }}
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            Rate Donee
                          </RateButton>
                        </Col>
                      </Row>
                    )}
                  </RequestInfo>
                </Col>
              </Row>
            </RequestCard>
          ))}
        </AnimatePresence>
      )}

      <RatingModal
        show={showRatingModal}
        onHide={() => {
          setShowRatingModal(false);
          setDoneeToRate(null);
        }}
        onSubmit={handleSubmitRating}
        title="Rate Donee"
        userToRate="donee"
        isLoading={loadingRatingSubmit}
      />
    </RequestsContainer>
  );
};

export default DonationRequests;