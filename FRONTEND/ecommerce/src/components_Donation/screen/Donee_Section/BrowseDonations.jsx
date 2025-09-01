import { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Badge,
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import ImageSlider from "../../ImageSlider";
import EmptyState from "../../EmptyState";
import { getUserCity } from "../../LocationService";
import {
  listDonations,
  submitDonationRequest,
} from "../../../actions/donationActions";
import { DONATION_REQUEST_SUBMIT_RESET } from "../../../constants/donationConstants";
import AuthCheck from "../../AuthCheck";

const DonationsContainer = styled(motion.div)`
  margin-bottom: 30px;
`;

const DonationsTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 25px;
  font-weight: bold;
`;

const DonationCard = styled(motion.div)`
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #dee2e6;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const CategoryBadge = styled(Badge)`
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 20px;
  margin-left: 10px;
`;

const DonationInfo = styled.div`
  padding: 15px;
`;

const DonationTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;

const DonorName = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 10px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
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

const LocationInfo = styled.div`
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  svg {
    margin-right: 5px;
  }
`;

const DateInfo = styled.div`
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  svg {
    margin-right: 5px;
  }
`;

const RequestButton = styled(Button)`
  background-color: #34a85a;
  border-color: #34a85a;
  width: 100%;
  font-weight: 500;
  &:hover {
    background-color: #2d9650;
    border-color: #2d9650;
  }
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
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
    border-color: #34a85a;
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`;

const FormSelect = styled(Form.Select)`
  &:focus {
    border-color: #34a85a;
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #34a85a;
  border-color: #34a85a;
  width: 100%;
  font-weight: 500;
  &:hover {
    background-color: #2d9650;
    border-color: #2d9650;
  }
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const FilterLabel = styled.div`
  font-weight: 500;
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

const FilterSelect = styled(Form.Select)`
  width: auto;
  min-width: 150px;
  &:focus {
    border-color: #34a85a;
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`;

const LocationDetectingText = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin-right: 8px;
    animation: spin 2s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
`;

const BrowseDonations = () => {
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const donationList = useSelector((state) => state.donationList || {});
  const {
    loading: loadingDonations,
    error: errorDonations,
    donations = [],
  } = donationList;

  const donationRequestSubmit = useSelector(
    (state) => state.donationRequestSubmit || {}
  );
  const {
    loading: loadingRequest,
    success: successRequest,
    error: errorRequest,
  } = donationRequestSubmit;

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [requestForm, setRequestForm] = useState({
    request_reason: "",
    additional_info: "",
    phone_no: "",
    email: userInfo?.email || "",
    full_name: userInfo?.name || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [filters, setFilters] = useState({
    category: "",
    seasonal_clothing: "",
    size: "",
  });
  const [userCity, setUserCity] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [showCityOnly, setShowCityOnly] = useState(true);

  useEffect(() => {
    const detectCityAndFetchDonations = async () => {
      try {
        setIsDetectingLocation(true);
        const detectedCity = await getUserCity();
        setUserCity(detectedCity);
        dispatch(listDonations(showCityOnly ? detectedCity : ""));
      } catch (error) {
        console.error("Failed to detect city:", error);
        setUserCity("Unknown");
        dispatch(listDonations(""));
      } finally {
        setIsDetectingLocation(false);
      }
    };

    detectCityAndFetchDonations();
  }, [dispatch, showCityOnly]);

  useEffect(() => {
    console.log("Fetched donations:", donations); // Log donations for debugging
  }, [donations]);

  useEffect(() => {
    if (successRequest) {
      setShowRequestModal(false);
      setSelectedDonation(null);
      setRequestForm({
        request_reason: "",
        additional_info: "",
        phone_no: "",
        email: userInfo?.email || "",
        full_name: userInfo?.name || "",
      });
      setFormErrors({});
      setTimeout(() => {
        dispatch({ type: DONATION_REQUEST_SUBMIT_RESET });
      }, 3000);
    }
  }, [successRequest, dispatch]);

  const handleRequestClick = useCallback((donation) => {
    console.log("Selected donation:", donation); // Log selected donation
    setSelectedDonation(donation);
    setRequestForm({
      request_reason: "",
      additional_info: "",
      phone_no: "",
      email: userInfo?.email || "",
      full_name: userInfo?.name || "",
    });
    setFormErrors({});
    setShowRequestModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowRequestModal(false);
    setSelectedDonation(null);
    setRequestForm({
      request_reason: "",
      additional_info: "",
      phone_no: "",
      email: userInfo?.email || "",
      full_name: userInfo?.name || "",
    });
    setFormErrors({});
  }, []);

  const handleRequestChange = useCallback((e) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      category: "",
      seasonal_clothing: "",
      size: "",
    });
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!requestForm.request_reason) {
      errors.request_reason = "Please select a reason for your request.";
    }
    if (!requestForm.additional_info) {
      errors.additional_info = "Please provide additional information.";
    }
    if (!requestForm.phone_no) {
      errors.phone_no = "Please enter your phone number.";
    } else if (!/^\d{11}$/.test(requestForm.phone_no)) {
      errors.phone_no = "Please enter a valid 11-digit phone number.";
    }
    return errors;
  };

  const handleSubmitRequest = useCallback(
    (e) => {
      e.preventDefault();
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const finalRequestData = {
        ...requestForm,
        email: userInfo?.email || "",
        full_name: userInfo?.name || "",
      };

      console.log("Submitting donation request with data:", finalRequestData);

      dispatch(submitDonationRequest(selectedDonation.id, finalRequestData));
    },
    [dispatch, requestForm, selectedDonation, userInfo]
  );

  const handleToggleLocationFilter = useCallback(() => {
    setShowCityOnly((prev) => !prev);
  }, []);

  const filteredDonations = donations.filter((donation) => {
    return (
      (filters.category === "" || donation.category === filters.category) &&
      (filters.seasonal_clothing === "" ||
        donation.seasonal_clothing === filters.seasonal_clothing) &&
      (filters.size === "" || donation.size === filters.size)
    );
  });

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
    <AuthCheck>
      <DonationsContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <DonationsTitle>Available Donations</DonationsTitle>
        </motion.div>

        {successRequest && (
          <Alert variant="success" className="mb-3">
            Your request has been submitted successfully! The donor will be
            notified.
          </Alert>
        )}

        {(errorDonations || errorRequest) && (
          <Alert variant="danger" className="mb-3">
            {errorDonations || errorRequest}
          </Alert>
        )}

        {isDetectingLocation || loadingDonations ? (
          <LocationDetectingText>
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
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            {isDetectingLocation
              ? "Detecting your location..."
              : "Loading donations..."}
          </LocationDetectingText>
        ) : (
          <>
            {donations.length > 0 && (
              <motion.div variants={itemVariants}>
                <FilterContainer>
                  <FilterLabel>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: "5px" }}
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filters:
                  </FilterLabel>

                  <FilterSelect
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    <option value="shirts">Shirts</option>
                    <option value="pants">Pants</option>
                    <option value="jackets">Jackets</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                  </FilterSelect>

                  <FilterSelect
                    name="seasonal_clothing"
                    value={filters.seasonal_clothing}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Seasons</option>
                    <option value="summer">Summer</option>
                    <option value="winter">Winter</option>
                    <option value="all_seasons">All Seasons</option>
                  </FilterSelect>

                  <FilterSelect
                    name="size"
                    value={filters.size}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Sizes</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xl">XL</option>
                    <option value="xxl">XXL</option>
                  </FilterSelect>

                  {userCity && userCity !== "Unknown" && (
                    <Button
                      variant={showCityOnly ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={handleToggleLocationFilter}
                    >
                      {showCityOnly
                        ? "Show All Cities"
                        : `Show Only ${userCity}`}
                    </Button>
                  )}

                  {(filters.category ||
                    filters.seasonal_clothing ||
                    filters.size) && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
                </FilterContainer>

                {userCity && userCity !== "Unknown" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      marginBottom: "15px",
                      fontSize: "0.9rem",
                      color: "#6c757d",
                    }}
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
                      style={{ marginRight: "5px" }}
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Your location: <strong>{userCity}</strong>
                    {showCityOnly && (
                      <span> (showing donations in your city only)</span>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            <Row>
              <AnimatePresence>
                {filteredDonations.map((donation) => (
                  <Col md={6} key={donation.id}>
                    <DonationCard
                      variants={itemVariants}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      }}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: 20 }}
                      layout
                    >
                      <ImageSlider
                        images={
                          donation.images && donation.images.length > 0
                            ? donation.images
                            : ["/placeholder.jpg"]
                        }
                        height={250}
                      />
                      <DonationInfo>
                        <DonationTitle>
                          {donation.cloth_type}
                          <CategoryBadge bg="primary">
                            {donation.category}
                          </CategoryBadge>
                        </DonationTitle>
                        <DonorName>
                          Donor:{" "}
                          {donation.isAnonymous
                            ? "Anonymous"
                            : donation.full_name}
                        </DonorName>
                        <InfoGrid>
                          <InfoItem>
                            <div className="label">Quantity:</div>
                            <div className="value">{donation.quantity}</div>
                          </InfoItem>
                          <InfoItem>
                            <div className="label">Size:</div>
                            <div className="value">{donation.size}</div>
                          </InfoItem>
                          <InfoItem>
                            <div className="label">Season:</div>
                            <div className="value">
                              {(() => {
                                switch (donation.season) {
                                  case "summer":
                                    return "Summer";
                                  case "winter":
                                    return "Winter";
                                  case "all_seasons":
                                    return "All Seasons";
                                  default:
                                    return "Not specified";
                                }
                              })()}
                            </div>
                          </InfoItem>
                        </InfoGrid>
                        <LocationInfo>
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
                          {donation.city}
                        </LocationInfo>
                        <DateInfo>
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
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Posted on{" "}
                          {new Date(donation.created_at).toLocaleDateString()}
                        </DateInfo>
                        <RequestButton
                          onClick={() => handleRequestClick(donation)}
                          disabled={donation.donor === userInfo?.id}
                        >
                          {donation.donor === userInfo?.id
                            ? "Your Donation"
                            : "Request This Donation"}
                        </RequestButton>
                      </DonationInfo>
                    </DonationCard>
                  </Col>
                ))}
              </AnimatePresence>
            </Row>

            {filteredDonations.length === 0 && (
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
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                }
                title={
                  filters.category || filters.seasonal_clothing || filters.size
                    ? "No matching donations found"
                    : userCity && showCityOnly
                    ? `No donations available in ${userCity}`
                    : "No donations available"
                }
                description={
                  filters.category || filters.seasonal_clothing || filters.size
                    ? "Try adjusting your filters to see more results."
                    : userCity && showCityOnly
                    ? "Try expanding your search to all cities or check back later."
                    : "Check back later for new donations in your area."
                }
                actionText={
                  filters.category || filters.seasonal_clothing || filters.size
                    ? "Clear Filters"
                    : userCity && showCityOnly
                    ? "Show All Cities"
                    : null
                }
                onAction={
                  filters.category || filters.seasonal_clothing || filters.size
                    ? handleClearFilters
                    : userCity && showCityOnly
                    ? handleToggleLocationFilter
                    : null
                }
                iconColor="#34A85A"
                buttonColor="#34A85A"
              />
            )}
          </>
        )}

        <AnimatePresence>
          {showRequestModal && (
            <Modal
              show={showRequestModal}
              onHide={handleCloseModal}
              centered
              backdrop="static"
            >
              <Modal.Header closeButton>
                <ModalTitle>Request Donation</ModalTitle>
              </Modal.Header>
              <Modal.Body>
                {errorRequest && (
                  <Alert variant="danger" className="mb-3">
                    {errorRequest}
                  </Alert>
                )}

                {selectedDonation && (
                  <Form onSubmit={handleSubmitRequest}>
                    <FormGroup>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl
                        type="text"
                        value={userInfo?.name || "Unknown"}
                        readOnly
                        className="bg-light"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl
                        type="email"
                        value={userInfo?.email || ""}
                        readOnly
                        className="bg-light"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Why do you need this donation?</FormLabel>
                      <FormSelect
                        name="request_reason"
                        value={requestForm.request_reason}
                        onChange={handleRequestChange}
                        required
                      >
                        <option value="">Select a reason</option>
                        <option value="personal_need">Personal Need</option>
                        <option value="family_need">Family Need</option>
                        <option value="community_program">
                          Community Program
                        </option>
                        <option value="homeless_shelter">
                          Homeless Shelter
                        </option>
                        <option value="disaster_relief">Disaster Relief</option>
                        <option value="others">Other</option>
                      </FormSelect>
                      {formErrors.request_reason && (
                        <ErrorText>{formErrors.request_reason}</ErrorText>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl
                        as="textarea"
                        rows={3}
                        name="additional_info"
                        value={requestForm.additional_info}
                        onChange={handleRequestChange}
                        placeholder="Please provide more details about your request"
                        required
                      />
                      {formErrors.additional_info && (
                        <ErrorText>{formErrors.additional_info}</ErrorText>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Your Phone Number</FormLabel>
                      <FormControl
                        type="tel"
                        name="phone_no"
                        value={requestForm.phone_no}
                        onChange={handleRequestChange}
                        placeholder="Enter your phone number (11 digits)"
                        required
                        maxLength={11}
                      />
                      {formErrors.phone_no && (
                        <ErrorText>{formErrors.phone_no}</ErrorText>
                      )}
                    </FormGroup>

                    <div className="d-grid gap-2">
                      <SubmitButton type="submit" disabled={loadingRequest}>
                        {loadingRequest ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Submitting...
                          </>
                        ) : (
                          "Submit Request"
                        )}
                      </SubmitButton>
                    </div>
                  </Form>
                )}
              </Modal.Body>
            </Modal>
          )}
        </AnimatePresence>
      </DonationsContainer>
    </AuthCheck>
  );
};

export default BrowseDonations;
