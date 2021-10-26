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
import { UiContext } from "../../context/uiContext";
import { Typography } from "@mui/material";
import classes from "./addRecipe.style.module.scss";
import FourthStep from "./fourthStep/fourthStep";

export default function AddRecipe(): ReactElement | null {
  const [page, setPage] = React.useState<number | null>(1);
  const [name, setName] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState<string>("");
  const [directions, setDirections] = React.useState<string>("");
  const [image, setImage] = React.useState<string | undefined>();
  const [tags, setTags] = React.useState<string[]>([]);
  const { token } = React.useContext(AuthContext);
  const { Screen } = React.useContext(UiContext);

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
    if (Screen && Screen.height > 600 && Screen.width > 500) {
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
        { data: recipeToSave, image: JSON.stringify(image) },
        {
          headers: {
            "x-auth-token": token!,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setName("");
        page && setPage(1);
        setIngredients("");
        setDirections("");
        setImage(undefined);
        setTags([]);
      });
  };

  return (
    <div className={classes.Page}>
      <Typography dir="rtl" variant="h3" component="div" gutterBottom>
        הוספת מתכון
      </Typography>
      {page ? (
        <div
          style={{
            width: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection:
              Screen && Screen.height > 600 && Screen.width > 500
                ? "row"
                : "column",
            margin: "auto",
            marginTop: "-0.75rem",
          }}
        >
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
            <div
              style={{
                width: "100%",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Button onClick={handleSubmit}>שמור</Button>
            </div>
          )}
          <div
            style={{
              margin: "0 auto",
              marginTop: "1rem",
              gap: "1rem",
            }}
          >
            <Pagination
              count={5}
              variant="outlined"
              page={page}
              onChange={(_, page: number) => {
                setPage(page);
              }}
              color="primary"
            />
          </div>
        </div>
      ) : (
        <>
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
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              flexBasis: "200%",
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
          <FourthStep image={image} setImage={setImage} />
          <div style={{ margin: "1rem" }}>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </>
      )}
    </div>
  );
}
