import RecipeActionTypes from "../types/recipe.types";
import { IRecipe } from "../../types/interfaces";
import { IUserTags } from "../../types/interfaces";

export interface State {
  recipes: { [key: string]: IRecipe };
  tags: IUserTags;
  recipeToDisplay: IRecipe | null;
}

const INITIAL_STATE = {
  recipes: {},
  tags: [],
  recipeToDisplay: null,
};

const recipeReducer = (state: State = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case RecipeActionTypes.CLEAR_RECIPE_TO_DISPLAY:
      return {
        ...state,
        recipeToDisplay: null,
      };

    case RecipeActionTypes.SET_RECIPE_FOR_DISPLAY:
      return {
        ...state,
        recipeToDisplay: action.payload,
      };

    case RecipeActionTypes.GET_RECIPES:
      return {
        ...state,
        recipes: { ...action.payload.recipes },
        tags: action.payload.tags,
      };

    case RecipeActionTypes.CLEAR_RECIPES:
      return {
        ...state,
        recipes: {},
        tags: [],
      };

    case RecipeActionTypes.ADD_RECIPE:
      const cpy = { ...state.recipes };
      cpy[action.payload.recipe._id] = action.payload.recipe;
      return {
        ...state,
        recipes: cpy,
        tags: [...Object.keys(action.payload.userTags)],
      };

    case RecipeActionTypes.REMOVE_RECIPE:
      const cpy1 = { ...state.recipes };
      delete cpy1[action.payload._id];
      return {
        ...state,
        recipes: cpy1,
        tags: [...Object.keys(action.payload.userTags)],
      };

    case RecipeActionTypes.UPDATE_RECIPE:
      const cpy2 = { ...state.recipes };
      cpy2[action.payload.recipe._id] = action.payload.recipe;
      return {
        ...state,
        recipes: cpy2,
        tags: [...Object.keys(action.payload.userTags)],
      };

    default:
      return state;
  }
};

export default recipeReducer;
