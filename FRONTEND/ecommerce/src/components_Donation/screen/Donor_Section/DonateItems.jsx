import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Table,
} from "react-bootstrap";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../../FileUpload";
import ToggleSwitch from "../../ToggleSwitch";
import { getUserCity } from "../../LocationService";
import RatingModal from "../../RatingModal";
import {
  submitDonation,
  listDonations,
  deleteDonation,
  updateDonation,
  submitDoneeRating,
  getDonorRatings,
} from "../../../actions/donationActions";
import {
  DONATION_SUBMIT_RESET,
  DONATION_UPDATE_RESET,
  DONATION_DELETE_RESET,
} from "../../../constants/donationConstants";
import AuthCheck from "../../AuthCheck";
import ConfirmationModal from "../../ConfirmationModal";

// Styled components remain unchanged
const FormContainer = styled(motion.div)`
  margin-bottom: 30px;
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 25px;
  font-weight: bold;
`;

const FormSection = styled(Card)`
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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

const FormCheck = styled(Form.Check)`
  .form-check-input:checked {
    background-color: #34a85a;
    border-color: #34a85a;
  }

  .form-check-input:focus {
    border-color: #34a85a;
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #34a85a;
  border-color: #34a85a;
  padding: 10px 30px;
  font-weight: 500;

  &:hover {
    background-color: #2d9650;
    border-color: #2d9650;
  }

  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(52, 168, 90, 0.25);
  }
`;

const ReadOnlyField = styled(FormControl)`
  background-color: #f8f9fa;
  cursor: not-allowed;
`;

const LocationDetectingText = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 5px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 5px;
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

const SuccessMessage = styled(motion.div)`
  padding: 20px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

const DonationsTable = styled(Table)`
  margin-top: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;

  th {
    background-color: #f8f9fa;
    font-weight: 600;
  }

  td {
    vertical-align: middle;
  }
`;

const ActionButton = styled(Button)`
  margin-right: 5px;
  padding: 5px 10px;
  font-size: 0.85rem;
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

const RateButton = styled(ActionButton)`
  background-color: #ffc107;
  border-color: #ffc107;

  &:hover {
    background-color: #e6af06;
    border-color: #e6af06;
  }
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.status) {
      case "live":
        return "#28a745";
      case "requested":
        return "#17a2b8";
      case "approved":
        return "#ffc107";
      case "completed":
        return "#6610f2";
      case "expired":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  }};
  color: white;
`;

const TabButton = styled(Button)`
  margin-right: 10px;
  margin-bottom: 20px;
  background-color: ${(props) => (props.active ? "#34A85A" : "white")};
  color: ${(props) => (props.active ? "white" : "#34A85A")};
  border-color: #34a85a;

  &:hover {
    background-color: ${(props) => (props.active ? "#2d9650" : "#f8f9fa")};
    color: ${(props) => (props.active ? "white" : "#34A85A")};
  }
`;

const ApiErrorMessage = styled(Alert)`
  margin-bottom: 20px;
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #34a85a;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 8px;

  svg {
    width: 12px;
    height: 12px;
    margin-right: 3px;
  }
`;

const DonateItems = () => {
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const donationSubmit = useSelector((state) => state.donationSubmit || {});
  const {
    loading: loadingSubmit,
    success: successSubmit,
    error: errorSubmit,
  } = donationSubmit;

  const donationList = useSelector((state) => state.donationList || {});
  const {
    loading: loadingList,
    donations = [],
    error: errorList,
  } = donationList;

  const donationDelete = useSelector((state) => state.donationDelete || {});
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = donationDelete;

  const donationUpdate = useSelector((state) => state.donationUpdate || {});
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = donationUpdate;

  const doneeRatingSubmit = useSelector(
    (state) => state.doneeRatingSubmit || {}
  );
  const {
    loading: loadingRatingSubmit,
    success: successRatingSubmit,
    error: errorRatingSubmit,
  } = doneeRatingSubmit;

  const donorRatingsList = useSelector((state) => state.donorRatingsList || {});
  const {
    loading: loadingRatingsList,
    ratings = [],
    error: errorRatingsList,
  } = donorRatingsList;

  const [formData, setFormData] = useState({
    clothType: "",
    condition: "",
    gender: "universal",
    category: "",
    quantity: "",
    size: "",
    season: "",
    pickupAddress: "",
    isAnonymous: false,
    images: [],
    city: "",
    phoneNo: "",
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDonationId, setEditDonationId] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [doneeToRate, setDoneeToRate] = useState(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [phoneError, setPhoneError] = useState(null);

  useEffect(() => {
    if (successSubmit) {
      setShowSuccessMessage(true);
      setFormData({
        clothType: "",
        condition: "",
        gender: "universal",
        category: "",
        quantity: "",
        size: "",
        season: "",
        pickupAddress: "",
        isAnonymous: false,
        images: [],
        city: formData.city,
        phoneNo: "",
      });
      const timer = setTimeout(() => {
        dispatch({ type: DONATION_SUBMIT_RESET });
        setShowSuccessMessage(false);
        dispatch(listDonations("", true)); // Update to include myDonations=true
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successSubmit, dispatch, formData.city]);

  useEffect(() => {
    if (userInfo) {
      dispatch(listDonations("", true)); // Pass myDonations=true
      dispatch(getDonorRatings(userInfo.id));
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (successDelete) {
      setShowDeleteModal(false);
      setDonationToDelete(null);
      setTimeout(() => {
        dispatch({ type: DONATION_DELETE_RESET });
        dispatch(listDonations("", true)); // Update to include myDonations=true
      }, 1000);
    }
  }, [successDelete, dispatch]);

  useEffect(() => {
    if (successUpdate) {
      setIsEditing(false);
      setEditDonationId(null);
      setFormData({
        clothType: "",
        condition: "",
        gender: "universal",
        category: "",
        quantity: "",
        size: "",
        season: "",
        pickupAddress: "",
        isAnonymous: false,
        images: [],
        city: formData.city,
        phoneNo: "",
      });
      setTimeout(() => {
        dispatch({ type: DONATION_UPDATE_RESET });
        dispatch(listDonations("", true)); // Update to include myDonations=true
      }, 1000);
    }
  }, [successUpdate, dispatch, formData.city]);

  useEffect(() => {
    const detectCity = async () => {
      try {
        setIsDetectingLocation(true);
        const detectedCity = await getUserCity();
        setFormData((prev) => ({ ...prev, city: detectedCity }));
      } catch (error) {
        console.error("Failed to detect city:", error);
      } finally {
        setIsDetectingLocation(false);
      }
    };
    detectCity();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (name === "phoneNo") {
      setPhoneError(null);
    }
  };

  const handleToggleAnonymous = () => {
    setFormData({
      ...formData,
      isAnonymous: !formData.isAnonymous,
    });
  };

  const handleImageUpload = (files) => {
    setUploadError(null);
    setFormData({
      ...formData,
      images: files,
    });
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError(null);
    setPhoneError(null);

    if (!validatePhoneNumber(formData.phoneNo)) {
      setPhoneError(
        "Please enter a valid 11-digit phone number (e.g., 12345678901)."
      );
      setIsUploading(false);
      return;
    }

    const data = {
      clothType: formData.clothType,
      condition:
        formData.condition === "new"
          ? "new_with_tag"
          : formData.condition === "likeNew"
          ? "like_new"
          : formData.condition,
      gender: formData.gender,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      size: formData.size.toLowerCase(),
      season: formData.season === "allSeason" ? "all_seasons" : formData.season,
      pickupAddress: formData.pickupAddress,
      isAnonymous: formData.isAnonymous,
      images: formData.images,
      city: formData.city,
      phoneNo: formData.phoneNo,
      // Include user-derived fields
      full_name: userInfo?.name || "Unknown",
      email: userInfo?.email || "",
      username: userInfo?.email ? userInfo.email.split("@")[0] : "unknown",
    };

    if (isEditing && editDonationId) {
      dispatch(updateDonation(editDonationId, data));
    } else {
      dispatch(submitDonation(data));
    }
    setIsUploading(false);
  };

  const handleEdit = (donation) => {
    setIsEditing(true);
    setEditDonationId(donation.id);
    setFormData({
      clothType: donation.clothType,
      condition:
        donation.condition === "new_with_tag"
          ? "new"
          : donation.condition === "like_new"
          ? "likeNew"
          : donation.condition,
      gender: donation.gender,
      category: donation.category,
      quantity: donation.quantity,
      size: donation.size,
      season: donation.season === "all_seasons" ? "allSeason" : donation.season,
      pickupAddress: donation.pickupAddress,
      isAnonymous: donation.isAnonymous,
      images: donation.images,
      city: donation.city,
      phoneNo: donation.phone_no,
    });
    setActiveTab("form");
  };

  const handleDelete = (donation) => {
    setDonationToDelete(donation);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (donationToDelete) {
      dispatch(deleteDonation(donationToDelete.id));
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditDonationId(null);
    setFormData({
      clothType: "",
      condition: "",
      gender: "universal",
      category: "",
      quantity: "",
      size: "",
      season: "",
      pickupAddress: "",
      isAnonymous: false,
      images: [],
      city: formData.city,
      phoneNo: "",
    });
  };

  const handleRateDonee = (donation) => {
    const doneeRequest = donation.requests.find(
      (req) => req.status === "approved"
    );
    if (doneeRequest) {
      setDoneeToRate({ id: doneeRequest.donee });
      setShowRatingModal(true);
    }
  };

  const handleSubmitRating = (ratingData) => {
    if (doneeToRate) {
      setIsSubmittingRating(true);
      dispatch(
        submitDoneeRating(doneeToRate.id, {
          score: ratingData.rating,
          comment: ratingData.comment,
        })
      )
        .then(() => {
          setIsSubmittingRating(false);
          setShowRatingModal(false);
          alert(`Rating of ${ratingData.rating} stars submitted successfully!`);
          dispatch(listDonations());
        })
        .catch((error) => {
          setIsSubmittingRating(false);
          console.error("Failed to submit rating:", error);
        });
    }
  };

  const formVariants = {
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
    <AuthCheck featureName="Donation Form">
      <FormContainer variants={formVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-4">
          <TabButton
            active={activeTab === "form"}
            onClick={() => setActiveTab("form")}
          >
            {isEditing ? "Edit Donation" : "Donate Items"}
          </TabButton>
          <TabButton
            active={activeTab === "list"}
            onClick={() => setActiveTab("list")}
          >
            My Donations
          </TabButton>
        </motion.div>

        {activeTab === "form" && (
          <>
            <motion.div variants={itemVariants}>
              <FormTitle>
                {isEditing ? "Edit Donation" : "Donation Form"}
              </FormTitle>
            </motion.div>

            {(errorSubmit || uploadError || phoneError) && (
              <motion.div variants={itemVariants}>
                <ApiErrorMessage variant="danger">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "10px" }}
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {errorSubmit || uploadError || phoneError}
                </ApiErrorMessage>
              </motion.div>
            )}

            {errorUpdate && (
              <motion.div variants={itemVariants}>
                <ApiErrorMessage variant="danger">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "10px" }}
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {errorUpdate}
                </ApiErrorMessage>
              </motion.div>
            )}

            {showSuccessMessage && (
              <SuccessMessage
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h4>Donation Submitted Successfully!</h4>
                <p>
                  Thank you for your generosity. Your donation has been
                  recorded.
                </p>
              </SuccessMessage>
            )}

            {successUpdate && (
              <SuccessMessage
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h4>Donation Updated Successfully!</h4>
                <p>Your donation has been updated successfully.</p>
              </SuccessMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants}>
                <FormSection>
                  <Row className="mb-3">
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>Full Name</FormLabel>
                        <ReadOnlyField
                          type="text"
                          value={userInfo?.name || "Unknown"}
                          readOnly
                        />
                        {userInfo?.isVerified && (
                          <div className="mt-1">
                            <VerifiedBadge>
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
                              Verified User
                            </VerifiedBadge>
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>City</FormLabel>
                        <ReadOnlyField
                          type="text"
                          value={
                            isDetectingLocation
                              ? "Detecting your location..."
                              : formData.city || "City not found"
                          }
                          readOnly
                        />
                        {isDetectingLocation && (
                          <LocationDetectingText>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="12" y1="2" x2="12" y2="6"></line>
                              <line x1="12" y1="18" x2="12" y2="22"></line>
                              <line
                                x1="4.93"
                                y1="4.93"
                                x2="7.76"
                                y2="7.76"
                              ></line>
                              <line
                                x1="16.24"
                                y1="16.24"
                                x2="19.07"
                                y2="19.07"
                              ></line>
                              <line x1="2" y1="12" x2="6" y2="12"></line>
                              <line x1="18" y1="12" x2="22" y2="12"></line>
                              <line
                                x1="4.93"
                                y1="19.07"
                                x2="7.76"
                                y2="16.24"
                              ></line>
                              <line
                                x1="16.24"
                                y1="7.76"
                                x2="19.07"
                                y2="4.93"
                              ></line>
                            </svg>
                            Detecting your location...
                          </LocationDetectingText>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>Email</FormLabel>
                        <ReadOnlyField
                          type="email"
                          value={userInfo?.email || ""}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl
                          type="text"
                          placeholder="Enter 11-digit phone number"
                          name="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>Cloth Type</FormLabel>
                        <FormControl
                          type="text"
                          placeholder="E.g., Cotton, Wool, Denim"
                          name="clothType"
                          value={formData.clothType}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>Condition</FormLabel>
                        <FormSelect
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select condition</option>
                          <option value="new">New with tags</option>
                          <option value="likeNew">Like new</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                        </FormSelect>
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup className="mb-3">
                    <FormLabel>For Gender</FormLabel>
                    <div>
                      <FormCheck
                        inline
                        type="radio"
                        label="Male"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                      />
                      <FormCheck
                        inline
                        type="radio"
                        label="Female"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                      />
                      <FormCheck
                        inline
                        type="radio"
                        label="Universal"
                        name="gender"
                        value="universal"
                        checked={formData.gender === "universal"}
                        onChange={handleChange}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <FileUpload
                      label="Cloth Images"
                      accept="image/*"
                      multiple={true}
                      minFiles={isEditing ? 0 : 1}
                      maxFiles={3}
                      maxFileSize={5}
                      helpText={
                        isEditing
                          ? "Upload new images or keep existing ones."
                          : "Please upload at least 1 image of the clothing items (max 5MB each)."
                      }
                      onChange={handleImageUpload}
                      value={formData.images}
                      isUploading={isUploading}
                      uploadError={uploadError}
                    />
                  </FormGroup>

                  <Row className="mb-3">
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>Category</FormLabel>
                        <FormSelect
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select category</option>
                          <option value="shirts">Shirts</option>
                          <option value="pants">Pants</option>
                          <option value="jackets">Jackets</option>
                          <option value="shoes">Shoes</option>
                          <option value="accessories">Accessories</option>
                        </FormSelect>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl
                          type="number"
                          min="1"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>Size Range</FormLabel>
                        <FormSelect
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select size</option>
                          <option value="small">S</option>
                          <option value="medium">M</option>
                          <option value="large">L</option>
                          <option value="xl">XL</option>
                          <option value="xxl">XXL</option>
                        </FormSelect>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <FormLabel>Seasonal Clothing</FormLabel>
                        <FormSelect
                          name="season"
                          value={formData.season}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select season</option>
                          <option value="summer">Summer</option>
                          <option value="winter">Winter</option>
                          <option value="allSeason">All-Season</option>
                        </FormSelect>
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup className="mb-3">
                    <FormLabel>Pickup Address</FormLabel>
                    <FormControl
                      as="textarea"
                      rows={3}
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <ToggleSwitch
                      isActive={formData.isAnonymous}
                      onToggle={handleToggleAnonymous}
                      label="Donate Anonymously (Your name and contact details will be hidden from the donee)"
                      activeColor="#34A85A"
                    />
                  </FormGroup>
                </FormSection>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="d-grid gap-2 d-md-flex justify-content-md-end"
              >
                {isEditing && (
                  <Button
                    variant="outline-secondary"
                    onClick={cancelEdit}
                    className="me-2"
                    disabled={loadingSubmit || loadingUpdate || isUploading}
                  >
                    Cancel
                  </Button>
                )}
                <SubmitButton
                  type="submit"
                  disabled={loadingSubmit || loadingUpdate || isUploading}
                >
                  {loadingSubmit || loadingUpdate || isUploading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      {isUploading
                        ? "Uploading..."
                        : isEditing
                        ? "Updating..."
                        : "Submitting..."}
                    </>
                  ) : isEditing ? (
                    "Update Donation"
                  ) : (
                    "Submit Donation"
                  )}
                </SubmitButton>
              </motion.div>
            </Form>
          </>
        )}

        {activeTab === "list" && (
          <motion.div variants={itemVariants}>
            <FormTitle>My Donations</FormTitle>

            {errorList && (
              <ApiErrorMessage variant="danger">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "10px" }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errorList}
              </ApiErrorMessage>
            )}

            {errorDelete && (
              <ApiErrorMessage variant="danger">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "10px" }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errorDelete}
              </ApiErrorMessage>
            )}

            {successDelete && (
              <Alert variant="success">Donation deleted successfully!</Alert>
            )}

            {loadingList ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading your donations...</p>
              </div>
            ) : donations.length === 0 ? (
              <Alert variant="info">
                You haven't made any donations yet. Use the Donate Items tab to
                make your first donation.
              </Alert>
            ) : (
              <DonationsTable striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation, index) => (
                    <tr key={donation.id}>
                      <td>{index + 1}</td>
                      <td>{donation.clothType}</td>
                      <td>{donation.category}</td>
                      <td>{donation.quantity}</td>
                      <td>
                        <StatusBadge status={donation.status}>
                          {donation.status.charAt(0).toUpperCase() +
                            donation.status.slice(1)}
                        </StatusBadge>
                      </td>
                      <td>
                        {new Date(donation.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        {donation.status === "live" && (
                          <>
                            <EditButton onClick={() => handleEdit(donation)}>
                              <i className="fas fa-edit"></i> Edit
                            </EditButton>
                            <DeleteButton
                              onClick={() => handleDelete(donation)}
                            >
                              <i className="fas fa-trash-alt"></i> Delete
                            </DeleteButton>
                          </>
                        )}
                        {donation.status === "completed" && (
                          <RateButton
                            onClick={() => handleRateDonee(donation)}
                            disabled={donation.requests.some(
                              (req) =>
                                req.status === "full_filled" &&
                                req.donee === userInfo.id
                            )}
                          >
                            {donation.requests.some(
                              (req) =>
                                req.status === "full_filled" &&
                                req.donee === userInfo.id
                            )
                              ? "Rated"
                              : "Rate Donee"}
                          </RateButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DonationsTable>
            )}
          </motion.div>
        )}
      </FormContainer>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Donation"
        message="Are you sure you want to delete this donation? This action cannot be undone."
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

      {ratings.length > 0 && (
        <div>
          <h4>Your Ratings</h4>
          <ul>
            {ratings.map((rating) => (
              <li key={rating.id}>
                {rating.score} stars - {rating.comment}
              </li>
            ))}
          </ul>
        </div>
      )}

      <RatingModal
        show={showRatingModal}
        onHide={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        title="Rate Donee"
        userToRate="donee"
        isLoading={isSubmittingRating}
        ratings={ratings}
      />
    </AuthCheck>
  );
};

export default DonateItems;
