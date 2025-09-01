'use client'

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Form, Card, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { resetPassword } from '../../actions/UserActions';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../components homescreen/Footer';

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

const ResetPasswordScreen = () => {
    const { uid, token } = useParams();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const resetPasswordState = useSelector(state => state.resetPassword);
    const { loading, success, error } = resetPasswordState;

    useEffect(() => {
        if (password !== password2) {
            setMessage('Passwords do not match');
        } else {
            setMessage(null);
        }

        if (success) {
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    }, [password, password2, success, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password === password2) {
            dispatch(resetPassword(uid, token, password));
        }
    };

    const renderErrorMessage = () => {
        if (error) {
            if (typeof error === 'object') {
                return Object.values(error).map((err, index) => (
                    <Alert key={index} variant="danger">{err}</Alert>
                ));
            } else {
                return <Alert variant="danger">{error}</Alert>;
            }
        }
        return null;
    };

    return (
        <Background>
            <Container className="mt-3">
                <Row className="justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                    <Col md={4}>
                        <Card className="reset-password-card">
                            <Card.Header as="h3" className="text-center bg-dark text-light">
                                Reset Password
                            </Card.Header>
                            <Card.Body>
                                {loading && (
                                    <div className="text-center mb-3">
                                        <Spinner animation="border" role="status" variant="light">
                                            <span className="sr-only">Loading...</span>
                                        </Spinner>
                                    </div>
                                )}
                                {success && <Alert variant="success">Password reset successfully. Redirecting to login...</Alert>}
                                {renderErrorMessage()}
                                {message && <Alert variant="danger">{message}</Alert>}
                                
                                <Form onSubmit={submitHandler}>
                                    <Form.Group controlId="formBasicPassword" className="mb-3">
                                        <Form.Label>
                                            <i className="fa-solid fa-lock"></i> New Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicPasswordConfirm" className="mb-3">
                                        <Form.Label>
                                            <i className="fa-solid fa-lock"></i> Confirm Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button variant="success" type="submit" className="w-100" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Reset Password'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <style jsx>{`
                .reset-password-card {
                    background-color: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                }
                .reset-password-card .card-body {
                    color: white;
                }
                .reset-password-card .form-control {
                    background-color: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                }
                .reset-password-card .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
                .reset-password-card .btn-success {
                    background-color: #28a745;
                    border-color: #28a745;
                }
            `}</style>
            <Footer/>
        </Background>
    );
};

export default ResetPasswordScreen;