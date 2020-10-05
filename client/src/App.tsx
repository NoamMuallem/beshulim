//basic imports
import React from "react";
import "./App.scss";
//components
import Header from "./components/header/header.component";
import Spinner from "./components/spinner/spinner.component";
import Add from "./components/add-recipe/add-recipe.component";
import MyRecipes from "./components/my-recipes/my-recipes.component";
import ProtectedRout from "./components/HOC/auth";
import AfterEmailVerify from "./components/after-email-verify/after-email-verify.component";
import RecipeDisplay from "./components/recepie-display/recipe-display.component";
//router
import { Route } from "react-router-dom";
import PWAPrompt from "react-ios-pwa-prompt";

function App() {
  return (
    <>
      <PWAPrompt
        timesToShow={3}
        copyTitle={"הוסף למסך הבית"}
        copyBody={
          "לאתר זה יש פונקצונליות של אפליקציה, הוסף אותה למסך הבית כדי להשתמש בה במסך מלא"
        }
        copyShareButtonLabel={"  1.לחץ על כפתור ״שתף״/״Share״"}
        copyAddHomeButtonLabel={"  2.בחר הוסף למסך הבית או Add to Home Screen"}
        copyClosePrompt={"לא עכשיו"}
      />
      <div className="App">
        <Header />
        <Spinner />
        <div className="Content">
          <Route
            path="/add"
            exact
            render={() => <ProtectedRout Component={<Add />} />}
          />
          <Route
            path="/"
            exact
            render={() => <ProtectedRout Component={<MyRecipes />} />}
          />
          <Route
            path="/email-verified"
            exact
            render={() => <AfterEmailVerify />}
          />
          <Route
            path="/display"
            render={() => <ProtectedRout Component={<RecipeDisplay />} />}
          />
        </div>
      </div>
    </>
  );
}

export default App;
