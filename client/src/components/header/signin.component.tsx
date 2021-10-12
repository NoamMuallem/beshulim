import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useFormInput from "../../hooks/input.hook";
import { AuthContext } from "../../context/auth.context";
import axios from "axios";

export default function SignIn() {
  const [open, setOpen] = React.useState(false);
  const email = useFormInput("");
  const password = useFormInput("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const { setUser, setToken } = React.useContext(AuthContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    //send request to server
    setLoading(true);
    setError("");
    axios
      .post("/api/auth/login", {
        email: email.value,
        password: password.value,
      })
      .then((res: any) => {
        setToken!(res.data.token);
        setUser(res.data.user);
      })
      .catch((e) => {
        console.log(e);
        setError(e.message);
        setLoading(false);
      });
    //is success full set user
    //if not show error
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    console.log("sign in mounted");
  }, []);

  return (
    <>
      <Button color="inherit" onClick={handleClickOpen}>
        Sign In
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          {loading && <div>Loading...</div>}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
              minWidth: "20vw",
            }}
          >
            <TextField
              style={{ minWidth: "100%" }}
              autoFocus
              margin="dense"
              label="Email Address"
              fullWidth
              type="email"
              variant="standard"
              {...email}
            />
            <TextField
              autoFocus
              style={{ minWidth: "100%" }}
              fullWidth
              margin="dense"
              label="password"
              type="password"
              variant="standard"
              {...password}
            />
            {error && <div style={{ color: "red" }}>{error}</div>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Sign In</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
