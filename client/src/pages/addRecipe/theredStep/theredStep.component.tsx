import { ReactElement } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";

interface Props {
  instructions: string;
  setInstructions: (value: string) => void;
}

export default function TheredStep({
  instructions,
  setInstructions,
}: Props): ReactElement | null {
  return (
    <div>
      <TextareaAutosize
        value={instructions}
        onChange={(e) => {
          setInstructions(e.target.value);
        }}
      />
    </div>
  );
}
