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
        //sort by name
        selectedFilterTags: [...action.payload].sort((a, b) =>
          a < b ? -1 : b < a ? 1 : 0
        ),
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
