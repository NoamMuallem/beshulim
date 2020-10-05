import UiActionTypes from "../types/ui.types";
import { IUserTags } from "../../types/interfaces";

export interface State {
  loading: boolean;
  selectedFilterTags: IUserTags;
  searchFiledFilter: string;
}

const INITIAL_STATE = {
  loading: false,
  selectedFilterTags: [],
  searchFiledFilter: "",
};

const uiReducer = (state: State = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case UiActionTypes.SET_LOADING:
      return {
        ...state,
        loading: true,
      };

    case UiActionTypes.STOP_LOADING:
      return {
        ...state,
        loading: false,
      };

    case UiActionTypes.SET_FILTER_TAGS:
      return {
        ...state,
        selectedFilterTags: [...action.payload],
      };

    case UiActionTypes.SET_SEARCH_FILED:
      return {
        ...state,
        searchFiledFilter: action.payload,
      };

    case UiActionTypes.CLEAR_FILTERS:
      return {
        ...state,
        searchFiledFilter: "",
        selectedFilterTags: [],
      };

    default:
      return state;
  }
};

export default uiReducer;
