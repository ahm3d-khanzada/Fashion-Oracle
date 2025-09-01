import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from 'framer-motion';
import Loader from "../Loader";
import Message from "../Message";
import { validEmail, validName, validPassword } from "./RegexScreen";
import { signup } from "../../actions/UserActions";
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

function SignupScreen() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState("fa fa-eye-slash");
  const [redirecting, setRedirecting] = useState(false);

  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isLongEnough, setIsLongEnough] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userSignup = useSelector((state) => state.userSignup);
  const { error, loading, userInfo } = userSignup;

  useEffect(() => {
    if (userInfo && !redirecting) {
          setMessage("Signup successful! Redirecting to login...");
          setRedirecting(true);
          setTimeout(() => navigate('/login'), 2000);
    }
    if (error) {
      setMessage(error);
    }
  }, [userInfo, error, redirecting, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage("");

    if (pass1 !== pass2) {
      setMessage("Passwords do not match");
    } else if (!validName.test(fname)) {
      setMessage("First Name should only contain letters and be a maximum of 12 characters");
    } else if (!validName.test(lname)) {
      setMessage("Last Name should only contain letters and be a maximum of 12 characters");
    } else if (!isLongEnough || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setMessage("Password does not meet the requirements");
    } else {
      dispatch(signup(fname, lname, email, pass1));
    }
  };

  const showPassword = () => {
    const x = document.getElementById("pass1");
    const y = document.getElementById("pass2");

    if (x && y) {
      if (x.type === "password" && y.type === "password") {
        x.type = "text";
        y.type = "text";
        setShow("fa fa-eye");
      } else {
        x.type = "password";
        y.type = "password";
        setShow("fa fa-eye-slash");
      }
    }
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPass1(pass);

    setHasUpperCase(/[A-Z]/.test(pass));
    setHasLowerCase(/[a-z]/.test(pass));
    setHasNumber(/\d/.test(pass));
    setHasSpecialChar(/[@$!%*?&]/.test(pass));
    setIsLongEnough(pass.length >= 8);
  };

  return (
    <Background>
      <Container className="mt-3">
        <Row className="justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <Col md={6}>
            <Card className="signup-card">
              <Card.Header as="h3" className="text-center bg-dark text-light">
                Sign Up
              </Card.Header>
              <Card.Body>
                {message && <Message variant='danger'>{message}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="fname">
                        <Form.Label>
                          <i className="fa fa-user"></i> First Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter First Name"
                          value={fname}
                          onChange={(e) => setFname(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="lname">
                        <Form.Label>
                          <i className="fa fa-user"></i> Last Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Last Name"
                          value={lname}
                          onChange={(e) => setLname(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
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
                    <div className="password-requirements">
                      <small className={isLongEnough ? "text-success" : "text-danger"}>
                        {isLongEnough ? '✔️' : '❌'} At least 8 characters long
                      </small>
                      <br />
                      <small className={hasUpperCase ? "text-success" : "text-danger"}>
                        {hasUpperCase ? '✔️' : '❌'} At least one uppercase letter
                      </small>
                      <br />
                      <small className={hasLowerCase ? "text-success" : "text-danger"}>
                        {hasLowerCase ? '✔️' : '❌'} At least one lowercase letter
                      </small>
                      <br />
                      <small className={hasNumber ? "text-success" : "text-danger"}>
                        {hasNumber ? '✔️' : '❌'} At least one number
                      </small>
                      <br />
                      <small className={hasSpecialChar ? "text-success" : "text-danger"}>
                        {hasSpecialChar ? '✔️' : '❌'} At least one special character
                      </small>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fa fa-key"></i> Confirm Password
                    </Form.Label>
                    <Form.Control
                      placeholder="Confirm Password"
                      required
                      type="password"
                      value={pass2}
                      onChange={(e) => setPass2(e.target.value)}
                      id="pass2"
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="success"
                    className="w-100"
                  >
                    Sign Up
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center">
                Already have an account?{" "}
                <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                  <Button variant="link">Login</Button>
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      <style jsx>{`
        .signup-card {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .signup-card .card-body {
          color: white;
        }
        .signup-card .form-control {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }
        .signup-card .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .signup-card .btn-success {
          background-color: #28a745;
          border-color: #28a745;
        }
        .signup-card a {
          color: #17a2b8;
        }
        .password-requirements {
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
      `}</style>
      <Footer/>
    </Background>
  );
}

export default SignupScreen;