import { createSelector } from "reselect";
import { State } from "../reducers/auth.reducer";

export const selectAuth = (state: any) => state.auth;

export const selectToken = createSelector(
  [selectAuth],
  (state: State) => state.token
);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (state: State) => state.isAuthenticated
);

export const selectUser = createSelector(
  [selectAuth],
  (state: State) => state.user
);
