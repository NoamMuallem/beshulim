import * as React from "react";
import { connect } from "react-redux";
import { login, passwordRecovery } from "../../../redux/actions/auth.actions";
import { clearErrors } from "../../../redux/actions/errorActions";
import { Button, Modal, Form, Alert, FormGroup, Nav } from "react-bootstrap";
import { IError, IUser } from "../../../types/interfaces";
import { createStructuredSelector } from "reselect";
import { selectError } from "../../../redux/selectors/error.selectors";
import { selectIsAuthenticated } from "../../../redux/selectors/auth.selectors";
import { E_ERROR } from "../../../types/enum";

export interface LoginModalProps {
  isAuthenticated: boolean | null;
  error: IError;
  login: (user: IUser) => void;
  clearErrors: () => void;
  passwordRecover: (email: string) => void;
}

export interface LoginModalState {
  modal: boolean;
  email: string;
  password: string;
  msg: string | null;
}

class LoginModal extends React.Component<LoginModalProps, LoginModalState> {
  constructor(props: LoginModalProps) {
    super(props);
    this.state = {
      modal: false,
      email: "",
      password: "",
      msg: null,
    };
  }

  componentDidUpdate(prevProps: LoginModalProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === E_ERROR.LOGIN_FAIL) {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, close modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };

  onForgotPass = async (e: any) => {
    e.preventDefault();
    const email = this.state.email;
    if (email.includes("@") && email.includes(".") && email.length > 2) {
      this.setState({ msg: null });
      this.props.passwordRecover(email);
    } else {
      this.setState({ msg: "נא להזין כתובת מייל תקינה לשיחזור הסיסמא" });
    }
  };

  onSubmit = (e: any) => {
    e.preventDefault();

    const { email, password } = this.state;

    const user = {
      email,
      password,
    };

    // Attempt to login
    this.props.login(user);
  };

  render() {
    return (
      <div>
        <Nav.Link onClick={this.toggle} href="#">
          התחבר
        </Nav.Link>
        <Modal show={this.state.modal} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title style={{ margin: "auto" }}>התחברות למערכת</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup>
                <Form.Label>כתובת אימייל</Form.Label>
                <Form.Control
                  autoComplete="off"
                  as="input"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="כתובת אימייל"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ email: e.target.value });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Form.Label>סיסמא</Form.Label>
                <Form.Control
                  autoComplete="off"
                  as="input"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="סיסמא"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ password: e.target.value });
                  }}
                />
                {this.state.msg ? (
                  <Alert variant={"danger"}>{this.state.msg}</Alert>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    onClick={this.onSubmit}
                    variant="primary"
                    style={{ marginTop: "2rem" }}
                  >
                    התחבר
                  </Button>
                  <Button
                    onClick={this.onForgotPass}
                    variant="secondary"
                    style={{ marginTop: "2rem" }}
                  >
                    שכחתי סיסמא
                  </Button>
                </div>
              </FormGroup>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isAuthenticated: selectIsAuthenticated,
  error: selectError,
});

const mapDispatchToProps = (dispatch: Function) => ({
  login: (user: IUser) => dispatch(login(user)),
  clearErrors: () => dispatch(clearErrors()),
  passwordRecover: (email: string) => dispatch(passwordRecovery(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
