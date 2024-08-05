import React from "react";
import { useDispatch } from "react-redux";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/electricActions";

const Header = () => {
  const dispatch = useDispatch();
  const userInfo = window.localStorage.getItem("userInfo");

  const logoutHandler = () => {
    dispatch(logout());
    window.localStorage.removeItem("userInfo"); // Ensure userInfo is removed
  };

  return (
    <Navbar style={{ backgroundColor: "#102A41" }} variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Electric Payment</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {userInfo ? (
              <>
                <LinkContainer to="/create">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Create-Payment
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Manage-Payment
                  </Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
              </>
            ) : (<>
              <LinkContainer to="/">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Manage-Payment
                  </Nav.Link>
                </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            </>
              
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
