import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../../context/auth.context";
import SignIn from "./signin.component";
import SignUp from "./signup.component";
import SignOut from "./signout.component";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function HideAppBar(props: Props) {
  const { user } = React.useContext(AuthContext);

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              Beshulim
            </Typography>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {user ? (
                <>
                  <Typography
                    style={{ margin: "auto" }}
                    variant="h6"
                    component="div"
                  >
                    {user.name}
                  </Typography>
                  <SignOut />
                </>
              ) : (
                <>
                  <SignIn />
                  <SignUp />
                </>
              )}
            </div>
            {/*<button style={{ marginLeft: "auto" }} color="inherit">
              Login
              </Button>*/}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>{props.children}</Container>
    </React.Fragment>
  );
}
