import { ReactElement } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Typography } from "@mui/material";

interface Props {
  ingredients: string;
  setIngredients: (value: string) => void;
}

export default function SecondStep({
  ingredients,
  setIngredients,
}: Props): ReactElement | null {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Typography dir="rtl" variant="h5" component="div">
        מרכיבים:
      </Typography>
      <TextareaAutosize
        minRows={15}
        maxRows={15}
        dir="auto"
        value={ingredients}
        onChange={(e) => {
          setIngredients(e.target.value);
        }}
        style={{ width: "100%", marginBottom: "auto" }}
      />
    </div>
  );
}
