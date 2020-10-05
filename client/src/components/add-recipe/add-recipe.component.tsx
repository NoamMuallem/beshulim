import React, { useState, useEffect } from "react";
import classes from "./add-recipe.module.scss";
import { Button, Alert } from "react-bootstrap";
import { IRecipe } from "../../types/interfaces";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
//Router
import { withRouter, RouteComponentProps } from "react-router-dom";
import { clearErrors } from "../../redux/actions/errorActions";
import { addRecipe, updateRecipe } from "../../redux/actions/recipe.actions";
import { selectError } from "../../redux/selectors/error.selectors";
import {
  selectTags,
  selectRecipeToDisplay,
} from "../../redux/selectors/recipe.selectors";
import { IError } from "../../types/interfaces";
import { selectToken } from "../../redux/selectors/auth.selectors";
import Description from "./step-one/step-one.component";
import Tags from "./step-two/step-two.component";
import AddImage from "./step-three/step-three.component";

export interface AddRecipeProps extends RouteComponentProps<any> {
  save: (recipe: IRecipe, history: any) => void;
  error: IError;
  clearErrors: () => void;
  recipeToDisplay: IRecipe | null;
  update: (recipe: IRecipe, history: any) => void;
}

const numPages = 3;

const AddRecipe: React.SFC<AddRecipeProps> = (props) => {
  const [step, setStep] = useState<number>(1);
  const [id, setId] = useState<string | null>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);
  const [tagsArray, setTagsArray] = useState<Array<string>>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [image, setImage] = useState<any | undefined>(undefined);

  //handling submitting plus verification
  const submit = () => {
    const tagsInRecipeFormat: { [key: string]: number } = {};
    tagsArray.forEach((tag: string) => (tagsInRecipeFormat[tag] = 1));
    const recipe: IRecipe = {
      //if we editing a recipe we already have an id
      ...(id ? { _id: id } : {}),
      name,
      directions: description,
      tags: tagsInRecipeFormat,
      image: image,
    };

    if (recipe.name === "") {
      setMsg("נא לבחור שם למתכון");
      setStep(1);
    } else if (recipe.directions === "") {
      setMsg("נא הוסף הוראות הכנה");
      setStep(1);
    } else if (Object.keys(recipe.tags).length === 0) {
      setMsg("נא הוסף תגיות");
      setStep(2);
    } else {
      if (id) {
        props.update(recipe, props.history);
      } else {
        props.save(recipe, props.history);
      }
    }
  };

  //change the state if in edit mode, copy data to edit into state
  useEffect(() => {
    if (props.recipeToDisplay) {
      setId(props.recipeToDisplay!._id);
      setName(props.recipeToDisplay!.name);
      setDescription(props.recipeToDisplay!.directions);
      setTagsArray(Object.keys(props.recipeToDisplay!.tags));
      setImage(props.recipeToDisplay!.image);
    }
  }, [props.recipeToDisplay]);

  //navigating form steps
  const pagination = () => (
    <div className={classes.Pagination}>
      <div className={classes.Nav}>
        <Button
          disabled={step === 1 ? true : false}
          onClick={() => {
            setStep(step - 1);
            setMsg("");
          }}
        >
          {"<"}
        </Button>
        {Array(numPages)
          .fill(0)
          .map((_, index) => index + 1)
          .map((pageNum) => (
            <Button
              className={classes.Indicator}
              key={pageNum}
              variant={pageNum === step ? "dark" : "outline-light"}
            >
              {pageNum}
            </Button>
          ))}
        <Button
          disabled={step === numPages ? true : false}
          onClick={() => {
            setStep(step + 1);
            setMsg("");
          }}
        >
          {">"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={classes.Container}>
      <span className={classes.Headline}>הוספת מתכון</span>
      <div className={classes.FormContent}>
        {msg ? (
          <Alert
            onClose={() => setMsg("")}
            dismissible
            style={{ margin: "10px auto", width: "fit-content" }}
            variant={"danger"}
          >
            {msg}
          </Alert>
        ) : null}
        {step === 1 ? (
          <Description
            setName={setName}
            setDescription={setDescription}
            name={name}
            description={description}
          />
        ) : null}
        {step === 2 ? (
          <Tags
            newTag={newTag}
            setNewTag={setNewTag}
            tagsArray={tagsArray}
            setTagsArray={setTagsArray}
          />
        ) : null}
        {step === 3 ? (
          <AddImage image={image} setImage={setImage} submit={submit} />
        ) : null}
      </div>
      {pagination()}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Function) => ({
  save: (recipe: IRecipe, history: any) => dispatch(addRecipe(recipe, history)),
  update: (recipe: IRecipe, history: any) =>
    dispatch(updateRecipe(recipe, history)),
  clearErrors: () => dispatch(clearErrors()),
});

const mapStateToProps = createStructuredSelector({
  tags: selectTags,
  error: selectError,
  recipeToDisplay: selectRecipeToDisplay,
  token: selectToken,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddRecipe)
) as any;
