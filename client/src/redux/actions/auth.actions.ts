import axios from "axios";
import { E_ERROR } from "../../types/enum";
import { returnErrors, clearErrors } from "./errorActions";
import AuthActionTypes from "../types/auth.types";
import { IAuthFunction, IConfigHeaders } from "../../types/interfaces";
import { startLoading, stopLoading } from "./ui.actions";
import UiActionTypes from "../types/ui.types";

// Check token & load user
export const loadUser = () => (dispatch: Function, getState: Function) => {
  // User loading
  dispatch(startLoading());

  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: AuthActionTypes.USER_LOADED,
        payload: res.data,
      });
      dispatch({
        type: UiActionTypes.STOP_LOADING,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AuthActionTypes.AUTH_ERROR,
      });
      dispatch({
        type: UiActionTypes.STOP_LOADING,
      });
    });
};

// Register User
export const register = ({ name, email, password }: IAuthFunction) => (
  dispatch: Function
) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({ name, email, password });
  //user loading
  dispatch(startLoading());
  axios
    .post("/api/auth/register", body, config)
    .then((res) => {
      dispatch({
        type: AuthActionTypes.REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch({
        type: UiActionTypes.STOP_LOADING,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: AuthActionTypes.REGISTER_FAIL,
      });
      dispatch({
        type: UiActionTypes.STOP_LOADING,
      });
    });
};

// Login User
export const login = ({ email, password }: IAuthFunction) => (
  dispatch: Function
) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({ email, password });

  //user loading
  dispatch(startLoading());
  axios
    .post("/api/auth/login", body, config)
    .then((res) => {
      dispatch({
        type: UiActionTypes.STOP_LOADING,
      });
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
      dispatch({
        type: AuthActionTypes.LOGIN_FAIL,
      });
      dispatch({
        type: UiActionTypes.STOP_LOADING,
      });
    });
};

// Logout User
export const logout = () => (dispatch: Function) => {
  dispatch({ type: AuthActionTypes.LOGOUT_SUCCESS });
};

// User Update
export const update = (
  email?: string,
  name?: string,
  password?: string,
  currentPassword?: string
) => (dispatch: Function, getState: Function) => {
  // loading
  dispatch(startLoading());

  //construct data object for req
  let data = {
    ...(email ? { email } : {}),
    ...(name ? { name } : {}),
    ...(password ? { password } : {}),
    ...(currentPassword ? { currentPassword } : {}),
  };

  axios
    .patch("/api/auth/user", data, tokenConfig(getState))
    .then(() => {
      dispatch({
        type: UiActionTypes.STOP_LOADING,
      });
      dispatch(clearErrors());
      dispatch(loadUser());
    })
    .catch((error) => {
      dispatch({
        type: UiActionTypes.STOP_LOADING,
      });
      //for handleing password change errors
      if (password) {
        dispatch(
          returnErrors(
            error.response.data,
            error.status,
            E_ERROR.CHANGE_PASSWORD_FAIL
          )
        );
        //for handeling email change errors
      } else if (email) {
        dispatch(
          returnErrors(
            error.response.data,
            error.status,
            E_ERROR.CHANGE_EMAIL_FAIL
          )
        );
      }
    });
};

export const deleteUser = () => (dispatch: Function, getState: Function) => {
  axios
    .delete("/api/auth/user", tokenConfig(getState))
    .then(() => {
      dispatch(logout());
    })
    .catch((error) => {
      dispatch(
        returnErrors(
          error.response.data,
          error.status,
          E_ERROR.DELETE_USER_FAIL
        )
      );
    });
};

export const passwordRecovery = (email: string) => (dispatch: Function) => {
  dispatch(startLoading());

  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios
    .get(`/api/auth/user/password/${email}`, config)
    .then((response) => {
      dispatch(stopLoading());
      alert(
        "מייל עם סיסמא חדשה נשלח עכשיו, ניתן לשנות את הסיסמא אחרי התחברות עם הסיסמא החדשה"
      );
    })
    .catch((e) => {
      dispatch(stopLoading());
      alert("לא נמצא מייל עם סיסמא זו");
    });
};

// Setup config/headers and token
export const tokenConfig = (getState: Function) => {
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
