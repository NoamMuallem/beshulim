import React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { ReactElement } from "react";
import { AuthContext } from "../../context/auth.context";
import { useHistory } from "react-router";
import RecipeExplorer from "../../components/recipeExplorer/recipeExplorer.component";

export default function HomePage(): ReactElement | null {
  const { user } = React.useContext(AuthContext);
  const history = useHistory();

  return (
    <div>
      {user ? (
        <div>
          <Fab
            size="medium"
            color="secondary"
            onClick={() => history.push("/add_recipe")}
            aria-label="add"
          >
            <AddIcon />
          </Fab>
          <RecipeExplorer />
        </div>
      ) : (
        <div>please sign in to view app data</div>
      )}
    </div>
  );
}
