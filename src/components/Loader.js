import React from "react";
import "../index.css";
import { Container } from "react-bootstrap";

const Loader = () => {
  return (
    <Container className="d-flex justify-content-center">
      <div className="spinner"></div>
    </Container>
  );
};

export default Loader;
