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
import useWindowSize from "../../hooks/windowSize.hook";
import { Typography } from "@mui/material";

export default function AddRecipe(): ReactElement | null {
  const [page, setPage] = React.useState<number | null>(1);
  const [name, setName] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState<string>("");
  const [directions, setDirections] = React.useState<string>("");
  const [tags, setTags] = React.useState<string[]>([]);
  const { token } = React.useContext(AuthContext);
  const Screen = useWindowSize();
  const divRef = React.useRef<HTMLDivElement>(null);

  const setRecipeData = (data: any) => {
    data.name && setName(data.name);
    data.recipeIngredient && setIngredients(data.recipeIngredient);
    data.recipeInstructions && setDirections(data.recipeInstructions);
    data.tags &&
      setTags(data.tags.split(",").map((element: string) => element.trim()));
    if (page) {
      setPage((ls) => (ls ? ++ls : 1));
    }
  };

  //listen to screen height and change the page variable acordingly
  React.useEffect(() => {
    if (Screen.height > 700 && Screen.width > 600) {
      setPage(null);
    } else {
      setPage(1);
    }
  }, [Screen]);

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
    <div
      style={{
        margin: "auto",
        padding: "2rem",
      }}
    >
      <Typography dir="rtl" variant="h3" component="div" gutterBottom>
        הוספת מתכון
      </Typography>
      {page ? (
        <>
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
            <SecondStep
              ingredients={ingredients}
              setIngredients={setIngredients}
            />
          ) : page === 4 ? (
            <TheredStep
              instructions={directions}
              setInstructions={setDirections}
            />
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </>
      ) : (
        <div
          ref={divRef}
          style={{
            width: "100%",
            height: "100%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Scrapper setRecipeData={setRecipeData} />
          <FirstStep
            name={name}
            setName={setName}
            tags={tags}
            setTags={setTags}
          />
          <div
            style={{
              width: "100%",
              height: "100",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              flexGrow: 1,
            }}
          >
            <SecondStep
              ingredients={ingredients}
              setIngredients={setIngredients}
            />
            <TheredStep
              instructions={directions}
              setInstructions={setDirections}
            />
          </div>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      )}
    </div>
  );
}
