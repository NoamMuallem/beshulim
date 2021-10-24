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
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <TextField
        placeholder="http://matkon.co.il/food"
        autoFocus
        margin="dense"
        label="link"
        fullWidth
        type="text"
        {...link}
      />
      <Button
        size="large"
        style={{ width: "auto", whiteSpace: "nowrap", padding: ".85rem" }}
        variant="outlined"
        onClick={copyRecipe}
      >
        copy recipe
      </Button>
    </div>
  );
}
