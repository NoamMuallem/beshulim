//basic imports
import React from "react";
//components
import { Button } from "react-bootstrap";
//Router
import { withRouter, RouteComponentProps } from "react-router-dom";
//redux
import { connect } from "react-redux";
import { clearRecipeToDisplay } from "../../redux/actions/recipe.actions";
interface Props extends RouteComponentProps<any> {
  clear: () => void;
}

const BackButton: React.FC<Props> = ({ history, clear }) => {
  return (
    <Button
      variant="outline-primary"
      onClick={() => {
        clear();
        history.goBack();
      }}
    >
      חזרה
    </Button>
  );
};

const mapDispatchToProps = (dispatch: Function) => ({
  clear: () => dispatch(clearRecipeToDisplay()),
});

export default withRouter(connect(null, mapDispatchToProps)(BackButton)) as any;
