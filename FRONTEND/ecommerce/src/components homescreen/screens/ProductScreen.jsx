import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button, Container, Breadcrumb } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProductsDetails } from "../../actions/productActions";
import Loader from "../../components login/Loader";
import Message from "../../components login/Message";

function ProductScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading } = productDetails;
  const [qty, setQty] = useState("1");

  useEffect(() => {
    dispatch(listProductsDetails(id));
  }, [dispatch, id]);

  const addtocartHandle = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const handleTryAgain = () => {
    dispatch(listProductsDetails(id)); // Retry fetching product details
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous screen
  };

  return (
    <Container className="product-screen">
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Product</Breadcrumb.Item>
      </Breadcrumb>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-50">
          <Loader />
        </div>
      ) : error ? (
        <div className="d-flex justify-content-center align-items-center vh-50">
          <Message variant="danger" onTryAgain={handleTryAgain} onBack={handleGoBack}>
            {error}
          </Message>
        </div>
      ) : (
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Button className="btn-primary btn-lg" onClick={addtocartHandle}>
              Add to Cart
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default ProductScreen;