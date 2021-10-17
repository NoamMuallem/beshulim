import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/home/home.component";
import AddRecipe from "./pages/addRecipe/addRecipe.component";
import Header from "./components/header/header";
import "./App.css";
import { AuthContext } from "./context/auth.context";

function App() {
  const { user } = React.useContext(AuthContext);
  return (
    <div className="App">
      <Header>
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />
          <Route
            path="/add_recipe"
            render={() => (user ? <AddRecipe /> : <HomePage />)}
          />
        </Switch>
      </Header>
    </div>
  );
}

export default App;
