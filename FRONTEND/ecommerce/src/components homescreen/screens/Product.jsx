import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "../../components login/Rating";

function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product.id}`}>
        <Card.Img
          src={`http://127.0.0.1:8000${product.image}`}
          className="img-fluid"
          style={{ width: "100%", height: "300px", objectFit: "cover" }} // Fixed size and fit
        />
      </Link>
      <Card.Body>
        <Link
          to={`/product/${product.id}`}
          className="text-dark"
          style={{ textDecoration: "none" }}
        >
          <Card.Title as="h3">
            <strong>{product.productname}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">
            {product.rating} from {product.reviews} reviews
          </div>
        </Card.Text>
        <Card.Text as="h4">Rs {product.price}</Card.Text>
        <Card.Text>
          <Rating
            value={product.rating}
            text={`${product.rating}`}
            color={"#f8e825"}
          ></Rating>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
