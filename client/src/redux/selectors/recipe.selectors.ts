import { createSelector } from "reselect";
import { State } from "../reducers/recipe.reducer";

const selectRecipe = (state: any) => state.recipes;

export const selectRecipes = createSelector([selectRecipe], (state: State) => {
  //turning the objects of recipe to array of recipes to
  //and sorting by creating date so user will have more consistent experience
  const recipesValues = Object.values(state.recipes);
  recipesValues.sort((a, b) =>
    a.date! < b.date! ? 1 : b.date! < a.date! ? -1 : 0
  );
  return [...recipesValues];
});

export const selectNumberOfRecipes = createSelector(
  [selectRecipe],
  (state: State) => {
    const array = Object.keys(state.recipes);
    return array.length;
  }
);

export const selectTags = createSelector(
  [selectRecipe],
  //recreate pointers for immutables
  (state: State) => [...state.tags]
);

export const selectRecipeToDisplay = createSelector(
  [selectRecipe],
  (state: State) => state.recipeToDisplay
);
