//basic imports
import React from "react";
//components
import { css } from "@emotion/core";
import SyncLoader from "react-spinners/SyncLoader";
//redux
import { connect } from "react-redux";
//reselect and selectors
import { createStructuredSelector } from "reselect";
import { selectLoading } from "../../redux/selectors/ui.selectors";

interface Props {
  loading: boolean;
}

const MySpinner: React.FC<Props> = ({ loading }) => {
  const override = css`
    position: fixed;
    top: 35%;
    left: 50%;
    z-index: 1080;
    margin-left: -40px;
    display: block;z
  `;

  return (
    <SyncLoader css={override} size={20} color={"#14b1ab"} loading={loading} />
  );
};

const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
});

export default connect(mapStateToProps)(MySpinner);
