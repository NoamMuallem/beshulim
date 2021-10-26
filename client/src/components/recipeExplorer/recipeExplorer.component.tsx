import React, { ReactElement } from "react";
import { IRecipe } from "src/interfaces";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import MultypleAutocompleteAsync from "../../components/multypleAutocompleteAsync";

export default function RecipeExplorer(): ReactElement | null {
  const { token } = React.useContext(AuthContext);
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [ingredients, _setIngredients] = React.useState<string[]>([]);
  const [limit, _setLimit] = React.useState<number>(5);
  const [createdOnBefore, setCreatedOnBefore] = React.useState<string>("");
  const [recipeList, setRecipeList] = React.useState<IRecipe[]>([]);
  const [noMoreResults, setNoMoreResults] = React.useState<boolean>(false);

  React.useEffect(() => {
    let queryString = "?";
    queryString = limit > 0 ? queryString + `limit=${limit}&` : queryString;
    queryString =
      recipeName !== ""
        ? queryString + `text=${recipeName.replace(" ", "+")}&`
        : queryString;
    queryString =
      tags.length > 0
        ? queryString +
          `tags=[${tags
            .map((tag) => tag.replace(" ", "+"))
            .map((value) => `"${value}"`)}]&`
        : queryString;
    queryString =
      ingredients.length > 0
        ? queryString +
          `ingredientsArray=${ingredients.map((ing) => ing.replace(" ", "+"))}&`
        : queryString;
    queryString =
      createdOnBefore !== ""
        ? queryString + `createdOnBefore=${createdOnBefore}&`
        : queryString;
    queryString = queryString.substring(0, queryString.length - 1);

    console.log("query string is: ", queryString);
    axios
      .get(`/api/recipes/${queryString}`, {
        headers: {
          "x-auth-token": token!,
        },
      })
      .then((res) => {
        const recipes: IRecipe[] = res.data as IRecipe[];
        console.log("respone.data is: ", res.data);
        //if the amount of the results is less then the limit then there are no more results
        if (recipes.length < limit) {
          setNoMoreResults(true);
        }
        setRecipeList((ls) => [...ls, ...(res.data as IRecipe[])]);
      });
  }, [recipeName, tags, ingredients, createdOnBefore]);

  //if recipe name tags or ingredients change, reset recipelist
  React.useEffect(() => {
    setRecipeList([]);
  }, [recipeName, tags, ingredients]);

  return (
    <div>
      <TextField
        value={recipeName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRecipeName(e.target.value)
        }
      />
      <MultypleAutocompleteAsync
        tags={tags}
        setTags={setTags}
        url={"/api/tags"}
        label="תגיות"
        onResCb={(data, setOptions) => {
          setOptions([...Object.values(data).map((value: any) => value.name)]);
        }}
        free={false}
      />
      <Autocomplete
        multiple
        freeSolo
        options={ingredients}
        getOptionLabel={(option) => option}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField {...params} label="מרכיבים" placeholder="בצל" />
        )}
      />
      <div>
        {recipeList.map((recipe) => (
          <Card key={recipe._id!} sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {recipe.name}
              </Typography>
              <Typography variant="h5" component="div">
                {recipe.tags.map((tag, index) =>
                  index < 5 ? (
                    <Chip key={index + tag} label={tag} variant="outlined" />
                  ) : index === 5 ? (
                    <span key={index}>...</span>
                  ) : null
                )}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </div>
      {!noMoreResults && (
        <Button
          onClick={() => {
            setCreatedOnBefore(recipeList[recipeList.length - 1].createdAt!);
          }}
        >
          more
        </Button>
      )}
    </div>
  );
}
