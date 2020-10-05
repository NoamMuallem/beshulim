import * as React from "react";
import { update } from "../../../redux/actions/auth.actions";
import { Modal, NavDropdown, FormGroup, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { loadUser } from "../../../redux/actions/auth.actions";

export interface ChangeNameProps {
  updateName: (email: undefined, name: string) => void;
  loadUser: () => void;
}

export interface ChangeNameState {
  isOpen: boolean;
  name: string;
}

class ChangeName extends React.Component<ChangeNameProps, ChangeNameState> {
  constructor(props: ChangeNameProps) {
    super(props);
    this.state = { isOpen: false, name: "" };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  onSubmit = () => {
    this.props.updateName(undefined, this.state.name);
    this.toggle();
    this.setState({ name: "" });
  };

  render() {
    return (
      <>
        <NavDropdown.Item
          onClick={() => this.toggle()}
          style={{ color: "black", textAlign: "right" }}
        >
          שינוי שם משתמש
        </NavDropdown.Item>
        <Modal show={this.state.isOpen} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title style={{ margin: "auto" }}>שינוי שם</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup>
                <Form.Label>שינוי שם משתמש</Form.Label>
                <Form.Control
                  autoComplete="off"
                  as="input"
                  type="text"
                  name="text"
                  id="text"
                  value={this.state.name}
                  placeholder="שם משתמש"
                  className="mb-3"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ name: e.target.value });
                  }}
                />

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
  updateName: (email: undefined, name: string) => dispatch(update(email, name)),
  loadUser: () => dispatch(loadUser()),
});

export default connect(null, mapDispatchToProps)(ChangeName);
