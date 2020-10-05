import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectIsAuthenticated } from "../../redux/selectors/auth.selectors";
import React from "react";
import Hompage from "../welcome/welcome.component";

interface ProtectedRouteProps {
  isAuthenticated: boolean | null;
  Component: JSX.Element;
}

const ProtectedRoute = ({
  Component,
  isAuthenticated,
}: ProtectedRouteProps) => {
  return <>{isAuthenticated ? Component : <Hompage />}</>;
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: selectIsAuthenticated,
});

export default connect(mapStateToProps)(ProtectedRoute);
