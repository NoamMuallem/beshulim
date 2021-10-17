import { ReactElement } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";

interface Props {
  ingredients: string;
  setIngredients: (value: string) => void;
}

export default function SecondStep({
  ingredients,
  setIngredients,
}: Props): ReactElement | null {
  return (
    <div>
      <TextareaAutosize
        value={ingredients}
        onChange={(e) => {
          setIngredients(e.target.value);
        }}
      />
    </div>
  );
}
