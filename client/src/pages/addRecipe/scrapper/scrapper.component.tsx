import React, { ReactElement } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { UiContext } from "../../../context/uiContext";

interface Props {
  setRecipeData: (value: Object) => void;
}

export default function AddRecipe({
  setRecipeData,
}: Props): ReactElement | null {
  const [link, setLink] = React.useState<string>("");
  const { Screen } = React.useContext(UiContext);

  const copyRecipe = () => {
    axios
      .post("/api/scrapper", { url: link })
      .then((res: any) => {
        console.log(res);
        setRecipeData(res.data);
        setLink("");
      })
      .catch((e) => {
        console.log(e);
        setLink("");
      });
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection:
          Screen && Screen.height > 600 && Screen.width > 500
            ? "row"
            : "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        gap: "1rem",
      }}
    >
      <TextField
        placeholder="http://matkon.co.il/food"
        autoFocus
        margin="dense"
        label="קישור"
        fullWidth
        type="text"
        value={link}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setLink(e.target.value);
        }}
      />
      <Button
        size="large"
        style={{
          width: "auto",
          whiteSpace: "nowrap",
          marginTop: "8px",
          marginBottom: "4px",
          padding: "14px",
        }}
        variant="outlined"
        onClick={copyRecipe}
      >
        העתק מתכון
      </Button>
    </div>
  );
}
