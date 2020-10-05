import React from "react";
import { connect } from "react-redux";
import { logout } from "../../../redux/actions/auth.actions";
import { Nav } from "react-bootstrap";
import { clearRecipes } from "../../../redux/actions/recipe.actions";
import { Link } from "react-router-dom";

export interface LogoutProps {
  logout: () => void;
  clearRecipes: () => void;
}

const Logout: React.SFC<LogoutProps> = ({
  logout,
  clearRecipes,
}: LogoutProps) => {
  return (
    <>
      <Nav.Link
        as={Link}
        to="/"
        onClick={() => {
          clearRecipes();
          logout();
        }}
      >
        התנתק
      </Nav.Link>
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch(logout()),
  clearRecipes: () => dispatch(clearRecipes()),
});

export default connect(null, mapDispatchToProps)(Logout);
