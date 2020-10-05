import AuthActionTypes from "../types/auth.types";
import { IUser } from "../../types/interfaces";

export interface State {
  token: string | null;
  isAuthenticated: boolean | null;
  user: IUser | null;
}

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  user: null,
};

const authReducer = (state: State = initialState, action: any) => {
  switch (action.type) {
    case AuthActionTypes.USER_LOADING:
      return {
        ...state,
      };
    case AuthActionTypes.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,

        user: action.payload,
      };
    case AuthActionTypes.LOGIN_SUCCESS:
    case AuthActionTypes.REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    case AuthActionTypes.AUTH_ERROR:
    case AuthActionTypes.LOGIN_FAIL:
    case AuthActionTypes.LOGOUT_SUCCESS:
    case AuthActionTypes.REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authReducer;
