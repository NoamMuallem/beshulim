import ErrorActionTypes from "../types/error.types";
import { IAction } from "../../types/interfaces";

export interface State {
  msg: {};
  status: null | number;
  id: null | string;
}

const initialState = {
  msg: {},
  status: null,
  id: null,
};

const errorReducer = (state: State = initialState, action: IAction) => {
  switch (action.type) {
    case ErrorActionTypes.GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id,
      };
    case ErrorActionTypes.CLEAR_ERRORS:
      return {
        msg: {},
        status: null,
        id: null,
      };
    default:
      return state;
  }
};

export default errorReducer;
