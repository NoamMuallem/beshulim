import React, { useState, useEffect } from "react";
import classes from "./my-recipes.module.scss";
import { IRecipe, IUserTags } from "../../types/interfaces";
import { connect } from "react-redux";
import { CardColumns, Alert, Form, Button } from "react-bootstrap";
import { createStructuredSelector } from "reselect";
import {
  selectRecipes,
  selectTags,
} from "../../redux/selectors/recipe.selectors";
import { setRecipeToDisplay } from "../../redux/actions/recipe.actions";
import { setFilterTags, setSearchFiled } from "../../redux/actions/ui.actions";
import {
  selectFilterTags,
  selectSearchFiled,
} from "../../redux/selectors/ui.selectors";
import RecipeCard from "./recipe-card/recipe-card.component";
import FontAwesome from "react-fontawesome";

export interface MyRecipesProps {
  recipes: Array<IRecipe>;
  userTags: IUserTags;
  selectedTagsArray: IUserTags;
  setSelectedTags: (tags: IUserTags) => void;
  searchFiled: string;
  setSearchFiled: (str: string) => void;
}

const MyRecipes: React.SFC<MyRecipesProps> = (props) => {
  //save the currently selected tag
  const [selectedTag, setSelectedTag] = useState<string>("");
  //the relevant recipes and tags to display
  const [recipesToDisplay, setRecipesToDisplay] = useState<Array<IRecipe>>([]);
  const [tagsToDisplay, setTagsToDisplay] = useState<{ [key: string]: number }>(
    {}
  );
  const [matchSearchRecipes, setMatchSearchRecipes] = useState<Array<IRecipe>>(
    []
  );

  //when user tags are retrieved from server
  useEffect(() => {
    let tagsObject: { [key: string]: number } = {};
    props.userTags.forEach((userTag) => {
      tagsObject[userTag] = 1;
    });
    setTagsToDisplay({ ...tagsObject });
    if (props.userTags.length > 0) {
      setSelectedTag(props.userTags[0]);
    }
  }, [props.userTags]);

  //when user recipes retrieved from server
  useEffect(() => {
    setRecipesToDisplay([...props.recipes]);
  }, [props.recipes]);

  //filter recipes to display by selected tags
  useEffect(() => {
    let allRacipes = [...props.recipes];
    let dispResp: Array<IRecipe> = [];
    allRacipes.forEach((recipe) => {
      let filtered = false;
      for (let i = 0; i < props.selectedTagsArray.length && !filtered; i++) {
        if (recipe.tags[props.selectedTagsArray[i]] === undefined) {
          filtered = true;
        }
      }
      if (!filtered) {
        dispResp.push(recipe);
      }
    });
    setRecipesToDisplay([...dispResp]);
  }, [props.selectedTagsArray, props.recipes]);

  //filter recipes by search filed
  useEffect(() => {
    setMatchSearchRecipes([
      ...recipesToDisplay.filter((recipe) =>
        recipe.name.includes(props.searchFiled)
      ),
    ]);
  }, [props.searchFiled, recipesToDisplay]);

  //filter tags by remaining recipes tags
  useEffect(() => {
    //updating to show only relevant tags
    let tagsObject: { [key: string]: number } = {};
    matchSearchRecipes.forEach((recipe) => {
      tagsObject = { ...tagsObject, ...recipe.tags };
    });
    setTagsToDisplay({ ...tagsObject });
  }, [matchSearchRecipes]);

  //when available tags change, set new Tag to the first available tag
  useEffect(() => {
    setSelectedTag(Object.keys(tagsToDisplay)[0]);
  }, [tagsToDisplay]);

  return (
    <div className={classes.Container}>
      <div className={classes.Headline}>המתכונים שלי</div>
      {props.recipes.length > 0 ? (
        <div className={classes.Filter}>
          <div className={classes.Inputs}>
            <div className={classes.Search}>
              <Form.Label style={{ marginTop: "0.7rem", fontSize: "1.2rem" }}>
                חפש לפי שם:
              </Form.Label>
              <Form.Control
                value={props.searchFiled}
                autoComplete="off"
                as="input"
                type="text"
                custom
                onChange={(e) => {
                  props.setSearchFiled(e.target.value);
                }}
              />
            </div>
            <div className={classes.TagsSearch}>
              <Form.Label style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
                חפש לפי תגיות:
              </Form.Label>
              <Form.Control
                value={selectedTag}
                autoComplete="off"
                as="select"
                custom
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                }}
              >
                {Object.keys(tagsToDisplay).map((tag) => (
                  <option
                    disabled={
                      props.selectedTagsArray.includes(tag) ? true : false
                    }
                    key={`${tag}select`}
                  >
                    {tag}
                  </option>
                ))}
              </Form.Control>
              <Button
                as={FontAwesome}
                name="plus"
                variant="outline-dark"
                onClick={() => {
                  if (!props.selectedTagsArray.includes(selectedTag)) {
                    props.setSelectedTags([
                      ...props.selectedTagsArray,
                      selectedTag,
                    ]);
                  }
                }}
              ></Button>
            </div>
          </div>
          <div className={classes.Tags}>
            {props.selectedTagsArray.map((tag) => (
              <Alert
                key={`${tag}tags`}
                style={{
                  fontSize: "1rem",
                }}
                variant="dark"
                onClose={() => {
                  props.setSelectedTags([
                    ...props.selectedTagsArray.filter(
                      (oldTag) => oldTag !== tag
                    ),
                  ]);
                }}
                dismissible
              >
                {tag}
              </Alert>
            ))}
          </div>
        </div>
      ) : null}

      <CardColumns style={{ maxWidth: "100%" }}>
        {matchSearchRecipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </CardColumns>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  searchFiled: selectSearchFiled,
  selectedTagsArray: selectFilterTags,
  recipes: selectRecipes,
  userTags: selectTags,
});

const mapDispatchToProps = (dispatch: Function, ownProps: MyRecipesProps) => ({
  displayRecipe: (recipe: IRecipe) =>
    dispatch(setRecipeToDisplay(recipe, ownProps)),
  setSelectedTags: (tags: IUserTags) => dispatch(setFilterTags(tags)),
  setSearchFiled: (str: string) => dispatch(setSearchFiled(str)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyRecipes) as any;
