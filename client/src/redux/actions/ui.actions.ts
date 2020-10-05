import UiActionTypes from "../types/ui.types";
import { IUserTags } from "../../types/interfaces";

export const startLoading = () => ({
  type: UiActionTypes.SET_LOADING,
});

export const stopLoading = () => {
  return {
    type: UiActionTypes.STOP_LOADING,
  };
};

export const setFilterTags = (tags: IUserTags) => {
  return {
    type: UiActionTypes.SET_FILTER_TAGS,
    payload: tags,
  };
};

export const setSearchFiled = (str: string) => {
  return {
    type: UiActionTypes.SET_SEARCH_FILED,
    payload: str,
  };
};
