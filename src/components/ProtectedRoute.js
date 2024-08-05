import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const userInfo = window.localStorage.getItem("userInfo");

  return (
    <Route
      {...rest}
      element={(props) =>
        userInfo ? <Component {...props} /> : <Navigate to="/" />
      }
    />
  );
};

export default ProtectedRoute;