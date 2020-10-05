import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import RegisterModal from "./auth/register-modal.component";
import LoginModal from "./auth/login-modal.component";
import Logout from "./auth/log-out.component";
import { IUser } from "../../types/interfaces";
import { createStructuredSelector } from "reselect";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../redux/selectors/auth.selectors";
import {
  clearRecipeToDisplay,
  getRecipes,
} from "../../redux/actions/recipe.actions";
import { selectNumberOfRecipes } from "../../redux/selectors/recipe.selectors";
import ChangeEmail from "./change-user-data/change-email";
import ChangeName from "./change-user-data/change-user-name";
import ChangePassword from "./change-user-data/change-user-password";
import DeleteUser from "./change-user-data/delete-user";
import { Link } from "react-router-dom";

export interface HeaderProps {
  isAuthenticated: boolean | null;
  numberOfRecipes: number;
  user: IUser | null;
  clear: () => void;
  getRecipes: () => void;
}

const Header: React.SFC<HeaderProps> = ({
  isAuthenticated,
  numberOfRecipes,
  user,
  clear,
  getRecipes,
}: HeaderProps) => {
  const [expended, setExpended] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && numberOfRecipes === 0) {
      getRecipes();
    }
  }, [isAuthenticated, getRecipes, numberOfRecipes]);

  const collapseNavbar = () => {
    setExpended(false);
  };

  const authLinks = () => {
    return (
      <>
        <Nav.Link
          style={{ color: "white" }}
          as={Link}
          onClick={() => {
            collapseNavbar();
            clear();
          }}
          to="/add"
        >
          הוסף מתכון
        </Nav.Link>
        <Nav.Link
          onClick={() => collapseNavbar()}
          style={{ color: "white", marginLeft: "auto" }}
          as={Link}
          to="/"
        >
          המתכונים שלי
        </Nav.Link>
        <Nav navbar className="mr-auto">
          <NavDropdown title={user!.name!} id="collasible-nav-dropdown">
            <ChangeName />
            <ChangeEmail />
            <ChangePassword />
            <NavDropdown.Divider />
            <DeleteUser />
          </NavDropdown>
          <Logout />
        </Nav>
      </>
    );
  };

  const guestLinks = () => {
    return (
      <Nav className="mr-auto">
        <RegisterModal />
        <LoginModal />
      </Nav>
    );
  };

  return (
    <Navbar
      onToggle={() => setExpended(!expended)}
      expanded={expended}
      fixed="top"
      style={{ width: "100vw" }}
      bg="dark"
      variant="dark"
      expand="sm"
    >
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Brand style={{ marginLeft: "1rem" }}>Beshulim</Navbar.Brand>
      <Navbar.Collapse>
        {isAuthenticated ? authLinks() : guestLinks()}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: selectIsAuthenticated,
  numberOfRecipes: selectNumberOfRecipes,
  user: selectUser,
});

const mapDispatchToProps = (dispatch: Function) => ({
  clear: () => dispatch(clearRecipeToDisplay()),
  getRecipes: () => dispatch(getRecipes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
