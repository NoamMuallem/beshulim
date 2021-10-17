import React, { ReactElement } from "react";
import Scrapper from "./scrapper/scrapper.component";
import Pagination from "@mui/material/Pagination";
import FirstStep from "./firstStep/firstStep.component";
import SecondStep from "./secondStep/secondStep.component";
import TheredStep from "./theredStep/theredStep.component";
import Button from "@mui/material/Button";
import { IRecipe } from "../../interfaces";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";

export default function AddRecipe(): ReactElement | null {
  const [page, setPage] = React.useState<number>(1);
  const [name, setName] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState<string>("");
  const [directions, setDirections] = React.useState<string>("");
  const [tags, setTags] = React.useState<string[]>([]);
  const { token } = React.useContext(AuthContext);

  const setRecipeData = (data: any) => {
    console.log(data);
    setPage((ls) => ++ls);
  };

  const handleSubmit = async () => {
    const recipeToSave: IRecipe = {
      name,
      directions,
      ingredients,
      tags,
    };
    console.log("this is the recipe to save: ", recipeToSave);
    axios
      .post(
        "/api/recipes",
        { data: recipeToSave },
        {
          headers: {
            "x-auth-token": token!,
          },
        }
      )
      .then((res) => console.log(res));
  };

  return (
    <div>
      <Pagination
        count={5}
        variant="outlined"
        page={page}
        onChange={(_, page: number) => {
          setPage(page);
        }}
        color="primary"
      />
      {page === 1 ? (
        <Scrapper setRecipeData={setRecipeData} />
      ) : page === 2 ? (
        <FirstStep
          name={name}
          setName={setName}
          tags={tags}
          setTags={setTags}
        />
      ) : page === 3 ? (
        <SecondStep ingredients={ingredients} setIngredients={setIngredients} />
      ) : page === 4 ? (
        <TheredStep instructions={directions} setInstructions={setDirections} />
      ) : (
        <Button onClick={handleSubmit}>Submit</Button>
      )}
    </div>
  );
}
