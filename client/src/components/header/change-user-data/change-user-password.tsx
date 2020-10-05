import * as React from "react";
import { update } from "../../../redux/actions/auth.actions";
import {
  Modal,
  NavDropdown,
  FormGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { connect } from "react-redux";
import { E_ERROR } from "../../../types/enum";
import { createStructuredSelector } from "reselect";
import { selectError } from "../../../redux/selectors/error.selectors";
import { IError } from "../../../types/interfaces";

export interface ChangePasswordProps {
  updatePassword: (
    email: undefined,
    name: undefined,
    password: string,
    currentPassword: string
  ) => void;
  error: IError;
}

export interface ChangePasswordState {
  //for modal open/ close
  isOpen: boolean;
  oldPassword: string;
  newConfirmPassword: string;
  newPassword: string;
  //will need seperate variable for msg because not all error will come from server, like verification errors
  msg: string | null;
}

class ChangePassword extends React.Component<
  ChangePasswordProps,
  ChangePasswordState
> {
  constructor(props: ChangePasswordProps) {
    super(props);
    this.state = {
      isOpen: false,
      oldPassword: "",
      newConfirmPassword: "",
      newPassword: "",
      msg: null,
    };
  }

  componentDidUpdate(prevProps: ChangePasswordProps) {
    //to show msg when redux error state changes
    const { error } = this.props;
    //check if there is a change in error type
    if (error !== prevProps.error) {
      // Check for change password error
      if (error.id === E_ERROR.CHANGE_PASSWORD_FAIL) {
        this.setState({ msg: error.msg.msg });
      } else {
        //no errors, toggle off the modal
        if (this.state.isOpen) {
          this.toggle();
        }
      }
    }
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      oldPassword: "",
      newConfirmPassword: "",
      newPassword: "",
      msg: null,
    });
  };

  onSubmit = () => {
    //validation and server request
    if (this.state.newConfirmPassword === this.state.newPassword) {
      if (this.state.newPassword.length >= 8) {
        this.props.updatePassword(
          undefined,
          undefined,
          this.state.newPassword,
          this.state.oldPassword
        );
        //clear fileds
        this.setState({
          oldPassword: "",
          newConfirmPassword: "",
          newPassword: "",
        });
      } else {
        this.setState({ msg: "הסיסמא החדשה צריכה להיות באורך 8 תוים לפחות" });
      }
    } else {
      this.setState({ msg: "הסיסמא החדשה אינה זהה" });
    }
  };

  render() {
    return (
      <>
        <NavDropdown.Item
          onClick={() => this.toggle()}
          style={{ color: "black", textAlign: "right" }}
        >
          שינוי סיסמא
        </NavDropdown.Item>
        <Modal show={this.state.isOpen} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title style={{ margin: "auto" }}>שינוי סיסמא</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup>
                <Form.Label>שינוי סיסמא</Form.Label>
                <Form.Control
                  autoComplete="off"
                  as="input"
                  type="password"
                  name="oldPassword"
                  id="oldPassword"
                  value={this.state.oldPassword}
                  placeholder="סיסמא ישנה"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ oldPassword: e.target.value });
                  }}
                />

                <Form.Control
                  autoComplete="off"
                  as="input"
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={this.state.newPassword}
                  placeholder="סיסמא חדשה"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ newPassword: e.target.value });
                  }}
                />

                <Form.Control
                  autoComplete="off"
                  as="input"
                  type="password"
                  name="newConfirmPassword"
                  id="newConfirmPassword"
                  value={this.state.newConfirmPassword}
                  placeholder="אשר סיסמא חדשה"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ newConfirmPassword: e.target.value });
                  }}
                />

                {this.state.msg ? (
                  <Alert variant={"danger"}>{this.state.msg}</Alert>
                ) : null}

                <Button
                  onClick={this.onSubmit}
                  color="dark"
                  style={{ marginTop: "2rem" }}
                  block
                >
                  שלח
                </Button>
              </FormGroup>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  updatePassword: (
    email: undefined,
    name: undefined,
    password: string,
    currentPassword: string
  ) => dispatch(update(email, name, password, currentPassword)),
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
