import ErrorActionTypes from "../types/error.types";
import { IMsg } from "../../types/interfaces";

// RETURN ERRORS
export const returnErrors = (msg: IMsg, status: number, id: any = null) => {
  return {
    type: ErrorActionTypes.GET_ERRORS,
    payload: { msg, status, id },
  };
};

// CLEAR ERRORS
export const clearErrors = () => {
  return {
    type: ErrorActionTypes.CLEAR_ERRORS,
  };
};
