import RecipeActionTypes from "../types/recipe.types";
import { IRecipe } from "../../types/interfaces";
import { returnErrors } from "./errorActions";
import axios from "axios";
import { IConfigHeaders } from "../../types/interfaces";
import UiActionTypes from "../types/ui.types";

export const addRecipe = (recipe: IRecipe, history: any) => (
  dispatch: Function,
  getState: Function
) => {
  dispatch({ type: UiActionTypes.SET_LOADING });
  let formData = new FormData();
  //if user uploaded an image append to form data
  if (recipe.image) {
    formData.append("image", recipe.image);
  }

  delete recipe.image;
  let data = {
    ...recipe,
  };
  formData.append("data", JSON.stringify(data));
  axios
    .post("/api/recipes", formData, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: RecipeActionTypes.ADD_RECIPE,
        payload: res.data,
      });
      dispatch(clearRecipeToDisplay());
      history.push("/");
      dispatch({ type: UiActionTypes.STOP_LOADING });
    })
    .catch((err) => {
      alert(
        "לא היה ניתן לשמור את המתכון נא לוודא שהחיבור לאנטרנט תקין ושכתובת המייל אושרה"
      );
      dispatch({ type: UiActionTypes.STOP_LOADING });
    });
};

export const getRecipes = () => (dispatch: Function, getState: Function) => {
  dispatch({ type: UiActionTypes.SET_LOADING });
  axios
    .get("/api/recipes", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: RecipeActionTypes.GET_RECIPES,
        payload: res.data,
      });
      dispatch({ type: UiActionTypes.STOP_LOADING });
    })
    .catch((err) => {
      if (err.response) {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "FETCH_RECIPES_FAIL"
          )
        );
      } else {
        dispatch(returnErrors(err.Error, 0, "FETCH_RECIPES_FAIL"));
      }
      dispatch({ type: UiActionTypes.STOP_LOADING });
    });
};

export const deleteRecipe = (_id: string) => (
  dispatch: Function,
  getState: Function
) => {
  dispatch({ type: UiActionTypes.SET_LOADING });
  axios
    .delete(`/api/recipes/${_id}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: RecipeActionTypes.REMOVE_RECIPE,
        payload: res.data,
      });
      dispatch({ type: UiActionTypes.STOP_LOADING });
    })
    .catch((err) => {
      if (err.response) {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "FETCH_RECIPES_FAIL"
          )
        );
      } else {
        dispatch(returnErrors(err.Error, 0, "FETCH_RECIPES_FAIL"));
      }
      dispatch({ type: UiActionTypes.STOP_LOADING });
    });
};

export const clearRecipes = () => ({
  type: RecipeActionTypes.CLEAR_RECIPES,
});

export const setRecipeToDisplay = (recipe: IRecipe, history: any) => (
  dispatch: Function
) => {
  dispatch({
    type: RecipeActionTypes.SET_RECIPE_FOR_DISPLAY,
    payload: recipe,
  });
  history.push("/display");
};

export const clearRecipeToDisplay = () => ({
  type: RecipeActionTypes.CLEAR_RECIPE_TO_DISPLAY,
});

export const updateRecipe = (recipe: IRecipe, history: any) => (
  dispatch: Function,
  getState: Function
) => {
  dispatch({ type: UiActionTypes.SET_LOADING });
  let formData = new FormData();
  //if user uploaded an image append to form data
  if (recipe.image) {
    formData.append("image", recipe.image);
  }

  delete recipe.image;
  let data = {
    ...recipe,
  };
  formData.append("data", JSON.stringify(data));
  axios
    .patch(`/api/recipes/${recipe._id!}`, formData, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: RecipeActionTypes.UPDATE_RECIPE,
        payload: res.data,
      });
      history.push("/");
      dispatch({ type: UiActionTypes.STOP_LOADING });
    })
    .catch((err) => {
      alert(
        "לא היה ניתן לעדכן את המתכון, נא לוודא שהחיבור לאנטרנט תקין, ושהמייל מאושר"
      );
      dispatch({ type: UiActionTypes.STOP_LOADING });
    });
};

// Setup config/headers and token
const tokenConfig = (getState: Function) => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config: IConfigHeaders = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
