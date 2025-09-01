
'use client'

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from 'framer-motion';
import Loader from "../Loader";
import Message from "../Message";
import { signin } from "../../actions/UserActions";
import Footer from "../../components homescreen/Footer";

function Background({ children }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="background-container">
      <div className="gradient-overlay"></div>
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: mousePosition.x + (Math.random() - 0.5) * 200,
            y: mousePosition.y + (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 1,
            type: 'spring',
            damping: 15,
            stiffness: 25,
          }}
        />
      ))}
      {children}
      <style jsx>{`
        .background-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #141415;
          overflow: hidden;
          font-family: GeistSans, "GeistSans Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(40,40,40,0.3) 0%, rgba(20,20,21,0.3) 100%);
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          filter: blur(1px);
        }
      `}</style>
    </div>
  )
}

function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState("fa fa-eye-slash");

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userSignin);
  const { loading, error, userInfo } = userLogin;

  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, pass1));
    if (!message && userInfo) {
      setMessage("Signin successful");
      navigate(redirect);
    } else {
      setMessage("Invalid credentials. Please try again.");
    }
  };

  const showPassword = () => {
    const x = document.getElementById("pass1");
    if (x.type === "password") {
      x.type = "text";
      setShow("fa fa-eye");
    } else {
      x.type = "password";
      setShow("fa fa-eye-slash");
    }
  };

  const handlePasswordChange = (e) => {
    setPass1(e.target.value);
  };

  return (
    <Background>
      <Container className="mt-3">
        <Row
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Col md={4}>
            {loading ? (
              <Loader />
            ) : (
              <Card className="login-card">
              <Card.Header as="h3" className="text-center bg-dark text-light">
                Sign In
              </Card.Header>
              <Card.Body>
                {/* Check if error or message is available */}
                {(error || message) && (
                  <Message variant="danger">
                    {error || message}
                  </Message>
                )}
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>
                        <i className="fa-solid fa-envelope"></i> Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className={show}></i> Password
                      </Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Checkbox onClick={showPassword} />
                        <Form.Control
                          placeholder="Enter Password"
                          required
                          type="password"
                          value={pass1}
                          onChange={handlePasswordChange}
                          id="pass1"
                        />
                      </InputGroup>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button className="btn btn-md btn-success" type="submit">
                        Sign In
                      </Button>
                    </div>
                  </Form>
                  <Row className="py-3">
                    <Col>
                      Forget password?
                      <Link to={"/forgetpassword"}> Reset Password</Link>
                    </Col>
                  </Row>
                  <Row className="py-3">
                    <Col>
                      Don't have an account?
                      <Link to={"/signup"}> Sign Up</Link>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
      <style jsx>{`
        .login-card {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .login-card .card-body {
          color: white;
        }
        .login-card .form-control {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }
        .login-card .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .login-card .btn-success {
          background-color: #28a745;
          border-color: #28a745;
        }
        .login-card a {
          color: #17a2b8;
        }
      `}</style>
      <Footer/>
    </Background>
  );
}

export default LoginScreen;
