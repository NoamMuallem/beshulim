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
import { E_ERROR } from "../../../types/enum";
import { IError } from "../../../types/interfaces";
import { selectError } from "../../../redux/selectors/error.selectors";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

export interface ChangeEmailProps {
  updateMail: (email: string) => void;
  error: IError;
}

export interface ChangeEmailState {
  isOpen: boolean;
  email: string;
  msg: string | null;
}

class ChangeEmail extends React.Component<ChangeEmailProps, ChangeEmailState> {
  constructor(props: ChangeEmailProps) {
    super(props);
    this.state = { isOpen: false, email: "", msg: null };
  }

  componentDidUpdate(prevProps: ChangeEmailProps) {
    //to show msg when redux error state changes
    const { error } = this.props;
    //check if there is a change in error type
    if (error !== prevProps.error) {
      // Check for change password error
      if (error.id === E_ERROR.CHANGE_EMAIL_FAIL) {
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
    this.setState({ isOpen: !this.state.isOpen, email: "", msg: null });
  };

  onSubmit = () => {
    this.props.updateMail(this.state.email);
    this.setState({ email: "" });
  };

  render() {
    return (
      <>
        <NavDropdown.Item
          onClick={() => this.toggle()}
          style={{ color: "black", textAlign: "right" }}
        >
          שינוי כתובת מייל
        </NavDropdown.Item>
        <Modal show={this.state.isOpen} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title style={{ margin: "auto" }}>
              שינוי כתובת מייל
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup>
                <Form.Label>כתובת אימייל חדשה</Form.Label>
                <Form.Control
                  autoComplete="off"
                  as="input"
                  type="email"
                  name="email"
                  id="email"
                  value={this.state.email}
                  placeholder="אימייל"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ email: e.target.value });
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
  updateMail: (email: string) => dispatch(update(email)),
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
