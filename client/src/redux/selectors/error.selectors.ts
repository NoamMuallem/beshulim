import { createSelector } from "reselect";
import { State } from "../reducers/error.reducer";

export const selectError = (state: any) => state.error;

export const selectMsg = createSelector(
  [selectError],
  (state: State) => state.msg
);

export const selectStatus = createSelector(
  [selectError],
  (state: State) => state.status
);

export const selectId = createSelector(
  [selectError],
  (state: State) => state.id
);
