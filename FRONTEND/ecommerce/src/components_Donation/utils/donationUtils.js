// Format date to a readable string
export const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Format date with time
  export const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleString(undefined, options)
  }
  
  // Calculate expiry time (24 hours from approval)
  export const calculateExpiryTime = (approvalTime) => {
    const expiryTime = new Date(approvalTime)
    expiryTime.setHours(expiryTime.getHours() + 24)
    return expiryTime
  }
  
  // Check if a donation request has expired
  export const isRequestExpired = (expiryTime) => {
    return new Date() > new Date(expiryTime)
  }
  
  // Generate a donor display name (respecting anonymity)
  export const getDonorDisplayName = (donor, isAnonymous) => {
    return isAnonymous ? "Anonymous" : donor.name
  }
  
  // Filter donations by city
  export const filterDonationsByCity = (donations, city) => {
    if (!city) {
      return donations
    }
    return donations.filter((donation) => donation.city.toLowerCase() === city.toLowerCase())
  }
  
  // Get status label
  export const getStatusLabel = (status) => {
    switch (status) {
      case "live":
        return "Live"
      case "requested":
        return "Requested"
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      case "expired":
        return "Expired"
      default:
        return "Unknown"
    }
  }
  
  // Get status color
  export const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "success"
      case "requested":
      case "pending":
        return "warning"
      case "approved":
        return "success"
      case "rejected":
      case "expired":
        return "danger"
      default:
        return "secondary"
    }
  }
  
  