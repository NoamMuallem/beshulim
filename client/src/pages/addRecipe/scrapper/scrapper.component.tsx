import { ReactElement } from "react";
import useFormInput from "../../../hooks/input.hook";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";

interface Props {
  setRecipeData: (value: Object) => void;
}

export default function AddRecipe({
  setRecipeData,
}: Props): ReactElement | null {
  //const [page, setPage] = React.useState();
  const link = useFormInput("");

  const copyRecipe = () => {
    axios
      .post("/api/scrapper", { url: link.value })
      .then((res: any) => {
        console.log(res);
        setRecipeData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <TextField
        style={{ minWidth: "100%" }}
        placeholder="http://matkon.co.il/food"
        autoFocus
        margin="dense"
        label="link"
        fullWidth
        type="text"
        variant="standard"
        {...link}
      />
      <Button onClick={copyRecipe}>copy recipe</Button>
    </div>
  );
}
