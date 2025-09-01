import React, { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { addToCart, removeFromCart } from "../../actions/CartActions";

function CartScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get cart state from Redux store
  const cart = useSelector((state) => state.cart);
  const { cartItems, loading, error } = cart;

  const productId = id;
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  const getCartSubtotal = () => {
    return cartItems
      .reduce((acc, item) => acc + item.qty * item.price, 0)
      .toFixed(2);
  };

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : cartItems.length === 0 ? (
            <Message variant="info">
              Your cart is empty. <Link to="/">Go back to shop</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image
                        src={item.image}
                        alt={item.productname}
                        fluid
                        className="cart-item-image"
                      />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>
                        {item.productname}
                      </Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.stockcount).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              ${getCartSubtotal()}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="w-100"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default CartScreen;
