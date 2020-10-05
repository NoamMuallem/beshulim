import * as React from "react";
import { IRecipe } from "../../types/interfaces";
import { createStructuredSelector } from "reselect";
import { selectRecipeToDisplay } from "../../redux/selectors/recipe.selectors";
import { connect } from "react-redux";
import { Button, Alert } from "react-bootstrap";
//Router
import { withRouter, RouteComponentProps } from "react-router-dom";
import classes from "./recipe-display.module.scss";
import BackButton from "../back-button/back-button";
import { selectToken } from "../../redux/selectors/auth.selectors";
import { deleteRecipe } from "../../redux/actions/recipe.actions";

export interface RecipeDisplayProps extends RouteComponentProps<any> {
  recipe: IRecipe | null;
  token: string | null;
  delete: (_id: string) => void;
}

const RecipeDisplay: React.SFC<RecipeDisplayProps> = (
  props: RecipeDisplayProps
) => {
  return props.recipe ? (
    <div className={classes.Container}>
      <span className={classes.Headline}>
        <span style={{ textAlign: "center" }}>{props.recipe.name}</span>
      </span>
      <div className={classes.Buttons}>
        <BackButton />
        <Button
          style={{ marginRight: "1rem" }}
          variant="outline-success"
          onClick={() => props.history.push("/add")}
        >
          ערוך
        </Button>
        <Button
          style={{ marginRight: "1rem" }}
          variant="outline-danger"
          onClick={async () => {
            await props.delete(props.recipe!._id!);
            props.history.push("/");
          }}
        >
          מחק
        </Button>
      </div>
      <div className={classes.ImagAndTags}>
        {props.recipe.image ? (
          <img
            style={{ borderRadius: "0.3rem", border: "1px solid black" }}
            width="200"
            src={props.recipe.image}
            alt=""
          />
        ) : null}
        <div className={classes.Tags}>
          {Object.keys(props.recipe.tags).map((tag) => (
            <Alert
              key={tag}
              style={{
                fontSize: "1rem",
              }}
              variant="dark"
            >
              {tag}
            </Alert>
          ))}
        </div>
      </div>
      <p className={classes.Description}>{props.recipe.directions}</p>
    </div>
  ) : null;
};

const mapStateToProps = createStructuredSelector({
  recipe: selectRecipeToDisplay,
  token: selectToken,
});

const mapDispatchToProps = (dispatch: Function) => ({
  delete: (_id: string) => dispatch(deleteRecipe(_id)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RecipeDisplay)
) as any;
