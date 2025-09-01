import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap"
import { logout } from "../actions/UserActions"
import logo from "../assets/logo/Capture-removebg-preview 4.png"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const dispatch = useDispatch()
  const userSignin = useSelector((state) => state.userSignin)
  const { userInfo } = userSignin

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const LogoutHandel = () => {
    dispatch(logout())
  }

  const navItems = [
    { name: "Home", path: "/", icon: "home" },
    { name: "Try-On", path: "/tryon", icon: "tshirt" },
    { name: "Recommendation", path: "/recommendation", icon: "magic" },
    { name: "Community", path: "/community", icon: "users" },
    { name: "Donation", path: "/donation", icon: "hand-holding-heart" },
  ]

  return (
    <>
      <style>
        {`
          .animated-header {
            background-color: #000000;
            transition: all 0.3s ease;
            padding: 1rem 0;
          }

          .animated-header.scrolled {
            padding: 0.5rem 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .nav-link {
            position: relative;
            color: #ffffff !important;
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            font-size: 1rem;
            margin: 0 0.5rem;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .nav-link::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(to right, #34A85A, #FFC107);
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
          }

          .nav-link:hover::before {
            transform: scaleX(1);
            transform-origin: left;
          }

          .nav-link:hover {
            transform: translateY(-2px);
          }

          .nav-link i {
            margin-right: 0.5rem;
            transition: all 0.3s ease;
          }

          .nav-link:hover i {
            transform: scale(1.2) rotate(10deg);
          }

          .brand-text {
            background: linear-gradient(to right, #34A85A, #FFC107);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
            font-size: 1.5rem;
          }

          .logo {
            height: 40px;
            width: auto;
            margin-right: 10px;
            transition: all 0.3s ease;
          }

          .logo:hover {
            transform: scale(1.1) rotate(5deg);
          }

          .auth-button {
            background: linear-gradient(to right, #34A85A, #FFC107);
            border: none;
            color: #000000;
            padding: 0.5rem 1rem;
            border-radius: 30px;
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            font-size: 1rem;
            transition: all 0.3s ease;
            margin-left: 0.5rem;
          }

          .auth-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(52, 168, 90, 0.3);
          }

          @media (max-width: 991px) {
            .navbar-nav {
              background-color: rgba(0, 0, 0, 0.9);
              padding: 1rem;
              border-radius: 10px;
            }

            .nav-link {
              padding: 0.5rem 1rem;
              margin: 0.25rem 0;
            }

            .auth-button {
              margin: 0.5rem 0;
              width: 100%;
            }
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
      <Navbar expand="lg" fixed="top" className={`animated-header ${isScrolled ? "scrolled" : ""}`}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src={logo || "/placeholder.svg"} alt="Fashion Oracle Logo" className="logo float-animation" />
            <span className="brand-text">Fashion Oracle</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              {navItems.map((item) => (
                <Nav.Link key={item.name} as={Link} to={item.path} className="nav-link">
                  <i className={`fas fa-${item.icon}`}></i>
                  {item.name}
                </Nav.Link>
              ))}
            </Nav>
            <Nav>
              {userInfo ? (
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic" className="auth-button">
                    <i className="fas fa-user mr-2"></i>
                    {userInfo.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={LogoutHandel}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Link to="/login" className="auth-button">
                    <i className="fas fa-sign-in-alt mr-2"></i>Login
                  </Link>
                  <Link to="/signup" className="auth-button">
                    <i className="fas fa-user-plus mr-2"></i>Sign Up
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ height: "80px" }} />
    </>
  )
}

export default Header

