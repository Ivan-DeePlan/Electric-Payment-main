import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { loginToPaiments } from "../actions/electricActions";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useSelector((state) => state.login);
  const { loading, error } = login;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loginToPaiments(email, password));
  };

  useEffect(() => {
    if (window.localStorage.getItem("userInfo")) {
      navigate("/");
    }
  }, []);

  return (
    <Container>
      <FormContainer>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              autoComplete="on"
              value={email ?? ""}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              autoComplete="on"
              value={password ?? ""}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <br />
          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </Form>
        <br />
        {error && <Message variant="danger">Wrong email or password!</Message>}
        {loading && <Loader />}
      </FormContainer>
    </Container>
  );
};

export default LoginScreen;
