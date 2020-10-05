import React, { useState } from "react";
import { Card, Accordion, Badge } from "react-bootstrap";
import { IRecipe } from "../../../types/interfaces";
import { connect } from "react-redux";
import { setRecipeToDisplay } from "../../../redux/actions/recipe.actions";
import { RouteComponentProps, withRouter } from "react-router-dom";
import classes from "./recipe-card.module.scss";
import FontAwesome from "react-fontawesome";

export interface RecipeCardProps extends RouteComponentProps {
  recipe: IRecipe;
  setResipeToDisplay: (recipe: IRecipe, history: any) => void;
}

const RecipeCard: React.SFC<RecipeCardProps> = ({
  recipe,
  history,
  setResipeToDisplay,
}: RecipeCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Accordion defaultActiveKey="0">
      <Card className={classes.RecipeCard}>
        <Card.Img
          onClick={() => setResipeToDisplay(recipe, history)}
          as="img"
          variant="top"
          src={recipe.image}
          alt={""}
        />
        <Card.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
          }}
        >
          <Card.Title
            onClick={() => setResipeToDisplay(recipe, history)}
            style={{ margin: "auto", textAlign: "center" }}
          >
            <strong>{recipe.name}</strong>
          </Card.Title>
          <Accordion.Toggle
            as={FontAwesome}
            className={isOpen ? "fa-rotate-180" : ""}
            name="caret-down"
            size="2x"
            style={{ textAlign: "center", width: "100%", height: "2.5rem" }}
            onClick={() => setIsOpen(!isOpen)}
            eventKey="1"
          />
        </Card.Body>
        <Accordion.Collapse eventKey="1">
          <Card.Body
            style={{
              maxWidth: "20rem",
              margin: "auto",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "5px",
            }}
          >
            {Object.keys(recipe.tags).map((tag) => (
              <Badge
                key={recipe._id + tag}
                variant="dark"
                style={{ fontSize: "1rem", margin: "0.4rem" }}
              >
                {tag}
              </Badge>
            ))}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

const mapDispatchToProps = (dispatch: Function) => ({
  setResipeToDisplay: (recipe: IRecipe, history: any) =>
    dispatch(setRecipeToDisplay(recipe, history)),
});

export default withRouter(connect(null, mapDispatchToProps)(RecipeCard)) as any;
