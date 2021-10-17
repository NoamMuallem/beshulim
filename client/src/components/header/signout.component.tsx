import React, { ReactElement } from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import Button from "@mui/material/Button";

export default function SignOut(): ReactElement | null {
  const { token, setUser, setToken } = React.useContext(AuthContext);

  const handleSignOut = () => {
    if (token) {
      axios
        .post(
          "/api/auth/user/logout",
          {},
          {
            headers: {
              "x-auth-token": token,
            },
          }
        )
        .then(() => {
          setToken!("");
          setUser("");
        });
    } else {
      setToken!("");
      setUser(undefined);
    }
  };

  return (
    <Button style={{ color: "inherit" }} onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
