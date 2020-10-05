import { createSelector } from "reselect";
import { State } from "../reducers/ui.reducer";

const selectUi = (state: any) => state.ui;

export const selectLoading = createSelector(
  [selectUi],
  (state: State) => state.loading
);

export const selectFilterTags = createSelector(
  [selectUi],
  (state: State) => state.selectedFilterTags
);

export const selectSearchFiled = createSelector(
  [selectUi],
  (state: State) => state.searchFiledFilter
);
