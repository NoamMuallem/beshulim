import { combineReducers } from "redux";
import errorReducer from "./reducers/error.reducer";
import authReducer from "./reducers/auth.reducer";
import recipeReducer from "./reducers/recipe.reducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import uiReducer from "./reducers/ui.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "recipes"],
  blacklist: ["ui", "error"],
};

const rootReducer = combineReducers({
  error: errorReducer,
  auth: authReducer,
  recipes: recipeReducer,
  ui: uiReducer,
});

export default persistReducer(persistConfig, rootReducer);
