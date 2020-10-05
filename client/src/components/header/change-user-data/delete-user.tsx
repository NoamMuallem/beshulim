import * as React from "react";
import { NavDropdown, Modal, Button, Alert } from "react-bootstrap";
import { deleteUser } from "../../../redux/actions/auth.actions";
import { E_ERROR } from "../../../types/enum";
import { IError } from "../../../types/interfaces";
import { selectError } from "../../../redux/selectors/error.selectors";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

export interface DeleteUserProps {
  delete: () => void;
  error: IError;
}

export interface DeleteUserState {
  isOpen: boolean;
  msg: string | null;
}

class DeleteUser extends React.Component<DeleteUserProps, DeleteUserState> {
  state = { isOpen: false, msg: null };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen, msg: null });
  };

  componentDidUpdate(prevProps: DeleteUserProps) {
    //to show msg when redux error state changes
    const { error } = this.props;
    //check if there is a change in error type
    if (error !== prevProps.error) {
      // Check for change password error
      if (error.id === E_ERROR.DELETE_USER_FAIL) {
        this.setState({ msg: error.msg.msg });
      } else {
        //no errors, toggle off the modal
        if (this.state.isOpen) {
          this.toggle();
        }
      }
    }
  }

  render() {
    return (
      <>
        <NavDropdown.Item
          onClick={() => this.toggle()}
          style={{ color: "red", textAlign: "right" }}
        >
          מחיקת משתמש
        </NavDropdown.Item>

        <Modal show={this.state.isOpen} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title>מחיקת משתמש</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>האם אתה בטוח שברצונך למחוק את המשתמש הקיים?</p>
            {this.state.msg ? (
              <Alert variant={"danger"}>{this.state.msg}</Alert>
            ) : null}
          </Modal.Body>
          <Modal.Footer
            style={{
              minHeight: "4rem",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => {
                this.toggle();
              }}
            >
              לא
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                this.props.delete();
              }}
            >
              כן אני בטוח
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  delete: () => dispatch(deleteUser()),
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteUser);
