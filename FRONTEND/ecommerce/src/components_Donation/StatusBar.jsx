"use client"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import styled from "styled-components";
import { motion } from "framer-motion";
import { listDonations, listDonorDonationRequests, listUserDonationRequests } from "../actions/donationActions";

const StatusContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 12px 18px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  max-width: 100%;
  flex-wrap: wrap;
  @media (max-width: 576px) {
    padding: 10px 12px;
  }
`;

const StatusLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  margin-right: 10px;
  color: #333;
  @media (max-width: 576px) {
    font-size: 14px;
  }
`;

const StatusBadge = styled(Badge)`
  font-size: 13px;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 20px;
  @media (max-width: 576px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const getStatusColor = (status) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "live":
      return "#34A85A"; // Green for active donations
    case "requested":
      return "#FFC107"; // Yellow for pending requests
    case "pending":
      return "#FFC107"; // Yellow for pending requests
    case "approved":
      return "#28a745"; // Dark green for approved actions
    case "completed":
      return "#6610f2"; // Purple for finalized donations
    case "full_filled":
      return "#6610f2"; // Purple for fulfilled requests
    case "rejected":
      return "#dc3545"; // Red for rejected actions
    case "expired":
      return "#6c757d"; // Gray for expired donations
    case "no activity":
      return "#adb5bd"; // Light gray for no donor activity
    case "no requests":
      return "#adb5bd"; // Light gray for no donee requests
    default:
      console.warn(`Unknown status: ${status}`);
      return "#6c757d"; // Fallback gray
  }
};

const getStatusTooltip = (status) => {
  switch (status.toLowerCase()) {
    case "live":
      return "You have active donations available.";
    case "requested":
      return "Your donation has pending requests.";
    case "pending":
      return "Your request is awaiting donor approval.";
    case "approved":
      return "A request or donation has been approved.";
    case "completed":
      return "A donation has been successfully completed.";
    case "full_filled":
      return "Your request has been fulfilled.";
    case "rejected":
      return "A request was rejected.";
    case "expired":
      return "Your donation has expired.";
    case "no activity":
      return "No donations created yet.";
    case "no requests":
      return "No requests submitted yet.";
    default:
      return "Current status of your activity.";
  }
};

const StatusBar = ({ userType, activeTab }) => {
  const dispatch = useDispatch();

  const donationList = useSelector((state) => state.donationList || {});
  const { donations = [], loading: donationLoading, error: donationError } = donationList;

  const donationRequestList = useSelector((state) => state.donationRequestList || {});
  const { requests = [], loading: requestLoading, error: requestError } = donationRequestList;

  const userSignin = useSelector((state) => state.userSignin || {});
  const { userInfo } = userSignin;

  useEffect(() => {
    if (userInfo) {
      if (userType === "donor") {
        dispatch(listDonations("", true));
        dispatch(listDonorDonationRequests());
      } else if (userType === "donee") {
        dispatch(listUserDonationRequests());
      }
    }
  }, [dispatch, userInfo, userType]);

  const getDonorStatus = () => {
    console.log("Donor Data:", { donations, requests });
    if (!donations.length && !requests.length) {
      console.log("Selected Status: No Activity");
      return "No Activity";
    }
    if (requests.some((req) => req.status === "approved")) {
      console.log("Selected Status: Approved");
      return "Approved";
    }
    if (donations.some((don) => don.status === "completed")) {
      console.log("Selected Status: Completed");
      return "Completed";
    }
    if (requests.some((req) => req.status === "pending")) {
      console.log("Selected Status: Requested");
      return "Requested";
    }
    if (donations.some((don) => don.status === "live")) {
      console.log("Selected Status: Live");
      return "Live";
    }
    if (donations.every((don) => don.status === "expired")) {
      console.log("Selected Status: Expired");
      return "Expired";
    }
    console.log("Selected Status: No Activity (fallback)");
    return "No Activity";
  };

  const getDoneeStatus = () => {
    console.log("Donee Data:", { requests });
    if (!requests.length) {
      console.log("Selected Status: No Requests");
      return "No Requests";
    }
    if (requests.some((req) => req.status === "full_filled")) {
      console.log("Selected Status: Fulfilled");
      return "Fulfilled";
    }
    if (requests.some((req) => req.status === "approved")) {
      console.log("Selected Status: Approved");
      return "Approved";
    }
    if (requests.some((req) => req.status === "pending")) {
      console.log("Selected Status: Pending");
      return "Pending";
    }
    if (requests.every((req) => req.status === "rejected")) {
      console.log("Selected Status: Rejected");
      return "Rejected";
    }
    console.log("Selected Status: No Requests (fallback)");
    return "No Requests";
  };

  const status = userType === "donor" ? getDonorStatus() : getDoneeStatus();
  const statusColor = getStatusColor(status);

  console.log(`Rendering Status: ${status}, Color: ${statusColor}`);

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{getStatusTooltip(status)}</Tooltip>}
    >
      <StatusContainer
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        key={status}
      >
        <StatusLabel>Status:</StatusLabel>
        <StatusBadge
          style={{
            backgroundColor: statusColor,
            color: "white",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </StatusBadge>
      </StatusContainer>
    </OverlayTrigger>
  );
};

export default StatusBar;