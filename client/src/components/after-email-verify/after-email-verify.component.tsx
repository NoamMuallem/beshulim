import * as React from "react";
import { connect } from "react-redux";
import { loadUser } from "../../redux/actions/auth.actions";
import { Redirect } from "react-router";

export interface AfterEmailVerifyProps {
  getUser: () => void;
}

const AfterEmailVerify: React.SFC<AfterEmailVerifyProps> = ({
  getUser,
}: AfterEmailVerifyProps) => {
  //getting user from server and redirected to homepage
  getUser();
  return (
    <>
      <Redirect to="/" />;
    </>
  );
};

const mapDispatchToProps = (dispatch: Function) => ({
  getUser: () => dispatch(loadUser()),
});

export default connect(null, mapDispatchToProps)(AfterEmailVerify);
