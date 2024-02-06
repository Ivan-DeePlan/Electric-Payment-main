import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/electricActions";

const Header = () => {
  const dispatch = useDispatch();
  const userInfo = window.localStorage.getItem("userInfo");

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <Navbar style={{ backgroundColor: "#102A41" }} variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Electric Payment</Navbar.Brand>
        {userInfo && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <LinkContainer to="/create">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Craete-Payment
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/manage">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Manage-Payment
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/">
                  <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
