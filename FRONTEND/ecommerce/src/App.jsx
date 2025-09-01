"use client"

import { useEffect } from "react"
import Footer from "./components homescreen/Footer"
import Header from "./components homescreen/Header"
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import HomeScreen from "./components homescreen/screens/HomeScreen"
import LoginScreen from "./components login/screens/LoginScreen"
import SignupScreen from "./components login/screens/SignupScreen"
import ProductScreen from "./components homescreen/screens/ProductScreen"
import ForgetPassword_Screen from "./components login/screens/ForgetPassword_Screen"
import ResetPasswordScreen from "./components login/screens/ResetPasswordScreen"
import Community_Home from "./components_community/Screens/Community_Home"
import Recommendation_Background from "./components Recommendation/Recommendation_Background"
import Donation_Background from "./components_Donation/Donation_Background"
import { useDispatch } from "react-redux"
import { loadUserFromStorage } from "./actions/UserActions"
import VTON_Background from "./components Virtual Try On/VTON_Background"
import FloatingButton from "./components_imgae_gen_prompt/screens/FloatingButton"
import Image_gen_prompt_Background from "./components_imgae_gen_prompt/Image_gen_prompt_Background"
// This component handles routing and footer rendering
function AppRoutes() {
  const location = useLocation()

  // List of paths where footer should not be shown
  const noFooterPaths = ["/login", "/signup", "/forgetpassword", "/reset-password", "/community"]

  const noHeaderPaths = ["/community"]

  // Check if the current route is one of the no-footer routes
  const showFooter = !noFooterPaths.some((path) => location.pathname.startsWith(path))

  const showHeader = !noHeaderPaths.some((path) => location.pathname.startsWith(path))

  // List of paths where floating button should not be shown
  const noFloatingButtonPaths = [
    "/login",
    "/signup",
    "/forgetpassword",
    "/reset-password",
    "/generate", // Hide floating button on the generate page
  ]

  // Check if the current route is one of the no-floating-button routes
  const showFloatingButton = !noFloatingButtonPaths.some((path) => location.pathname.startsWith(path))

  return (
    <>
      {showHeader && <Header />}
      <div className="main-content">
        <Routes>
          <Route exact path="/" element={<HomeScreen />} />
          <Route exact path="/product/:id" element={<ProductScreen />} />
          <Route exact path="/login" element={<LoginScreen />} />
          <Route exact path="/signup" element={<SignupScreen />} />
          <Route exact path="/forgetpassword" element={<ForgetPassword_Screen />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordScreen />} />
          <Route path="/community/*" element={<Community_Home />} />
          <Route exact path="/tryon" element={<VTON_Background />} />
          <Route exact path="/recommendation" element={<Recommendation_Background />} />
          <Route exact path="/donation/*" element={<Donation_Background />} />
          <Route exact path="/image_gen" element={<Image_gen_prompt_Background />} />
        </Routes>
      </div>
      {/* Footer will only show if not on certain pages */}
      {showFooter && <Footer />}
      {/* Floating button will only show if not on certain pages */}
      {showFloatingButton && <FloatingButton />}
    </>
  )
}

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUserFromStorage()) // Restore user authentication state
  }, [dispatch])

  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}