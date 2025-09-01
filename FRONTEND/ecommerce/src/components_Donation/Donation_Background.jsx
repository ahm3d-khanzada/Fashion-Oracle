import { Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import store from "../store" // Import the Redux store with donation reducers
import DonationLayout from "./DonationLayout"
import DonationHome from "./screen/Donation_Home"
import DonorDashboard from "./screen/Donor_Section/DonorDashboard"
import DonateItems from "./screen/Donor_Section/DonateItems"
import DonationRequests from "./screen/Donor_Section/DonationRequests"
import DoneeDashboard from "./screen/Donee_Section/DoneeDashboard"
import BrowseDonations from "./screen/Donee_Section/BrowseDonations"
import MyRequests from "./screen/Donee_Section/MyRequests"

const Donation_Background = () => {
  return (
    <Provider store={store}>
      <DonationLayout>
        <Routes>
          <Route path="/" element={<DonationHome />} />

          {/* Donor Routes */}
          <Route path="donor" element={<DonorDashboard />} />
          <Route path="donor/donate" element={<DonateItems />} />
          <Route path="donor/requests" element={<DonationRequests />} />

          {/* Donee Routes */}
          <Route path="donee" element={<DoneeDashboard />} />
          <Route path="donee/browse" element={<BrowseDonations />} />
          <Route path="donee/requests" element={<MyRequests />} />

          {/* Redirect any unmatched routes */}
          <Route path="*" element={<Navigate to="/donation" replace />} />
        </Routes>
      </DonationLayout>
    </Provider>
  )
}

export default Donation_Background

